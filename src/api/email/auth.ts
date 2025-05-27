import { useState } from 'react';
import axios from 'axios';

interface EmailUserData {
    email?: string;
    password?: string;
}

export function useEmailCallback() {
    const [userData, setUserData] = useState<EmailUserData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        loginWithOrcid(code)
            .then((data) => setUserData(data))
            .catch((err) => setError(err.message));
    }

    async function loginWithOrcid(code: string): Promise<EmailUserData> {
        try {
            const response = await axios.post('https://sandbox.cetaf.org/orcid/api/orcid/token', { code });

            if (response.status !== 200) {
                throw new Error('Failed to login with Email');
            }

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Backend error:', error.response?.data ?? error.message);
            } else {
                console.error('Unknown error:', error);
            }
            throw new Error('Failed to login with Email');
        }
    }

    return { userData, error };
}
