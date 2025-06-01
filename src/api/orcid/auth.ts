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
        // Remove the 'code' param from the URL after extracting it
        const url = new URL(window.location.href);
        url.searchParams.delete('code');
        window.history.replaceState({}, document.title, url.pathname + url.search);
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
                setError(error.response?.data?.message ?? 'An error occurred while logging in with ORCID');
            }
            else if (error === 'ORCID already exists in the system') {
                setError('This ORCID is already registered in the system');
            }
            else {
                setError('An unknown error occurred while logging in with ORCID');
            }
            throw new Error('Failed to login with ORCID');
        }
    }

    return { userData, error };
}
