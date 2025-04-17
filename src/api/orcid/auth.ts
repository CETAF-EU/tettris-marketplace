import { useEffect, useState } from 'react';
import axios from 'axios';

const ORCID_API_URL = 'https://orcid.org/oauth/token';
const ORCID_USER_INFO_URL = 'https://pub.orcid.org/v3.0/';

const clientId = import.meta.env.VITE_ORCID_CLIENT_ID;
const clientSecret = import.meta.env.VITE_ORCID_CLIENT_SECRET;
const redirectUri = import.meta.env.VITE_ORCID_REDIRECT_URI;

interface OrcidAuthResponse {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    orcid: string;
}

interface OrcidUserData {
    orcid: string;
    name: string;
    email?: string;
}

export function useOrcidCallback() {
    const [userData, setUserData] = useState<OrcidUserData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            loginWithOrcid(code)
                .then((data) => setUserData(data))
                .catch((err) => setError(err.message));
        }
    }, []);

    async function loginWithOrcid(code: string): Promise<OrcidUserData> {
        try {
            // Step 2: Exchange authorization code for access token
            const tokenResponse = await axios.post<OrcidAuthResponse>(ORCID_API_URL, new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri,
                code: code,
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Accept: 'application/json',
                },
            });

            const { access_token, orcid } = tokenResponse.data;

            // Step 3: Retrieve user data using the ORCID ID and access token
            const userResponse = await axios.get(`${ORCID_USER_INFO_URL}${orcid}/person`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    Accept: 'application/json',
                },
            });

            const userData = userResponse.data;
            console.log('User Data:', userData);
            return {
                orcid,
                name: `${userData.name['given-names'].value} ${userData.name['family-name'].value}`,
                email: userData.emails?.email?.[0]?.email, // Optional, if email is available
            };
        } catch (error) {
            console.error('Error during ORCID login:', error);
            throw new Error('Failed to login with ORCID');
        }
    }

    return { userData, error };
}
