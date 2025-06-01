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
                console.log('Failed to login with ORCID:', response.status, response.data);
                throw new Error('Failed to login with ORCID');
            }
            if (await checkIfOrcidExists(response.data.orcid) !== null){
                console.log('ORCID already exists in the system:', response.data.orcid);
                throw new Error('ORCID already exists in the system');
            }
            return response.data;
        } catch (error) {
            if (error === 'ORCID already exists in the system') {
                console.error('ORCID already exists in the system:', error);
                throw new Error('ORCID already exists in the system');
            }
            else if (axios.isAxiosError(error)) {
                console.error('Failed to login with ORCID:', error.response?.status, error.response?.data);
                throw new Error(error.response?.data?.message ?? 'Failed to login with ORCID');
            }
            else {
                setError('An unknown error occurred while logging in with ORCID');
                console.error('An unknown error occurred while logging in with ORCID:', error);
                throw new Error('Failed to login with ORCID');
            }
        }
    }

    return { userData, error };
}
