from fastapi import FastAPI, UploadFile, File, HTTPException, Query, status, Depends, Request
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pathlib import Path
import shutil
import uuid
from pydantic import BaseModel
import httpx
import os
from dotenv import load_dotenv
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from urllib.parse import quote_plus

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://marketplace.cetaf.org", "https://sandbox.cetaf.org"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files from /app/uploads
UPLOAD_DIR = Path("./uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")
MAX_PROFILE_PIC_SIZE = 2 * 1024 * 1024  # 2 MB

ORCID_CLIENT_ID = os.getenv("VITE_ORCID_CLIENT_ID")
ORCID_CLIENT_SECRET = os.getenv("VITE_ORCID_CLIENT_SECRET")
ORCID_REDIRECT_URI = os.getenv("VITE_ORCID_REDIRECT_URI")
IMAGE_API = os.getenv("VITE_IMAGE_API")

class ORCIDCode(BaseModel):
    code: str

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    if token != IMAGE_API:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid token"
        )

# Size Limit
async def limit_profile_picture(request: Request):
    content_length = request.headers.get("content-length")
    if content_length and int(content_length) > MAX_PROFILE_PIC_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Profile picture too large (max 2 MB)."
        )

# Upload Endpoint
@app.post("/api/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    _: None = Depends(limit_profile_picture),
    __: None = Depends(verify_token)
):
    suffix = Path(file.filename).suffix.lower()
    filename = f"{uuid.uuid4()}{suffix}"
    file_path = UPLOAD_DIR / filename

    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    return {"url": f"https://sandbox.cetaf.org/uploads/{filename}"}
@app.get("/api/orcid/search")
async def search_orcid(q: str = Query(..., min_length=1)):
    safe_query = quote_plus(q)
    url = f"https://pub.orcid.org/v3.0/expanded-search/?q={safe_query}"

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers={"Accept": "application/json"})

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch ORCID data")

        data = response.json()
        results = data.get("expanded-result", [])[:50]

        output = []
        for record in results:
            given = record.get("given-names", "")
            family = record.get("family-names", "")
            orcid_id = record.get("orcid-id", "")

            institutions = record.get("institution-name", [])
            if isinstance(institutions, str):
                institutions = [institutions]  # Ensure it's a list

            full_name = f"{given} {family}".strip()
            inst_string = ", ".join(institutions)
            display_name = f"{full_name} — {inst_string}" if inst_string else full_name

            if full_name and orcid_id:
                output.append({
                    "identifier": orcid_id,
                    "name": display_name
                })

        return output

@app.post("/api/orcid/token")
async def orcid_login(payload: ORCIDCode):
    token_url = "https://orcid.org/oauth/token"

    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            token_url,
            data={
                "client_id": ORCID_CLIENT_ID,
                "client_secret": ORCID_CLIENT_SECRET,
                "grant_type": "authorization_code",
                "code": payload.code,
                "redirect_uri": ORCID_REDIRECT_URI
            },
            headers={"Accept": "application/json"}
        )

        if token_response.status_code != 200:
            raise HTTPException(status_code=token_response.status_code, detail=token_response.text)

        token_data = token_response.json()
        access_token = token_data.get("access_token")
        orcid_id = token_data.get("orcid")

        user_response = await client.get(
            f"https://pub.orcid.org/v3.0/{orcid_id}/person",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/json"
            }
        )

        if user_response.status_code != 200:
            raise HTTPException(status_code=user_response.status_code, detail="Failed to fetch ORCID user info")

        user_data = user_response.json()

        name = user_data.get("name", {})
        given = name.get("given-names", {}).get("value", "")
        family = name.get("family-name", {}).get("value", "")
        full_name = f"{given} {family}".strip()

        email = None
        email_data = user_data.get("emails", {}).get("email", [])
        if email_data:
            primary_emails = [e for e in email_data if e.get("primary")]
            email = (primary_emails or email_data)[0].get("email")

        return {
            "orcid": orcid_id,
            "name": full_name,
            "email": email
        }

@app.get("/")
async def root():
    return {"message": "Welcome to the TETTRIs Marketplace API"}


def main():
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)


if __name__ == "__main__":
    main()
