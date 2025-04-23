import { useState } from 'react';
import axios from 'axios';

interface OrcidUserData {
    orcid: string;
    name: string;
    email?: string;
}

export function useOrcidCallback() {
    const [userData, setUserData] = useState<OrcidUserData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        loginWithOrcid(code)
            .then((data) => setUserData(data))
            .catch((err) => setError(err.message));
    }

    async function loginWithOrcid(code: string): Promise<OrcidUserData> {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/orcid/token', { code });

            if (response.status !== 200) {
                throw new Error('Failed to login with ORCID');
            }

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Backend error:', error.response?.data ?? error.message);
            } else {
                console.error('Unknown error:', error);
            }
            throw new Error('Failed to login with ORCID');
        }
    }

    return { userData, error };
}
