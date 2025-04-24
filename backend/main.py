from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import httpx
import os
from dotenv import load_dotenv
import uvicorn
from fastapi.middleware.cors import CORSMiddleware



load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"] for specific origin
    allow_credentials=True,
    allow_methods=["*"],  # or ["GET", "POST", "OPTIONS"]
    allow_headers=["*"],
)

ORCID_CLIENT_ID = os.getenv("VITE_ORCID_CLIENT_ID")
ORCID_CLIENT_SECRET = os.getenv("VITE_ORCID_CLIENT_SECRET")
ORCID_REDIRECT_URI = os.getenv("VITE_ORCID_REDIRECT_URI")


class ORCIDCode(BaseModel):
    code: str


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
    return {"message": "Welcome to the ORCID API"}


def main():
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)


if __name__ == "__main__":
    main()
