import { useState } from 'react';
import axios from 'axios';
import checkIfOrcidExists from './checkIfOrcidExists';

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
            const response = await axios.post('https://sandbox.cetaf.org/orcid/api/orcid/token', { code });

            if (response.status !== 200) {
                throw new Error('Failed to login with ORCID');
            }
            if (await checkIfOrcidExists(response.data.orcid) !== null){
                throw new Error('ORCID already exists in the system');
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
