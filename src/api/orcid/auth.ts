import { useEffect, useState } from 'react';
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

    useEffect(() => {
        if (!code) return;

        (async () => {
            try {
                const data = await loginWithOrcid(code);
                setUserData(data);
            } catch (err: any) {
                setError(err.message);
            }

            // Remove 'code' param from URL
            const url = new URL(window.location.href);
            url.searchParams.delete('code');
            window.history.replaceState({}, document.title, url.pathname + url.search);
        })();
    }, [code]);

    async function loginWithOrcid(code: string): Promise<OrcidUserData> {
        try {
            const response = await axios.post('https://sandbox.cetaf.org/orcid/api/orcid/token', { code });

            if (response.status !== 200) {
                throw new Error('Failed to login with ORCID');
            }

            const orcid = response.data.orcid;
            const exists = await checkIfOrcidExists(orcid);

            if (exists) {
                throw new Error('ORCID already exists in the system');
            }

            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message ?? 'Failed to login with ORCID');
            }

            // Re-throw known handled error
            if (error instanceof Error && error.message === 'ORCID already exists in the system') {
                throw error;
            }

            console.error('Unexpected ORCID login error:', error);
            throw new Error('Failed to login with ORCID');
        }
    }

    return { userData, error };
}
