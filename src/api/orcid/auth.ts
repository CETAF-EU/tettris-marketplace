import { useEffect, useState } from 'react';
import axios from 'axios';
import checkIfOrcidExists from './checkIfOrcidExists';

const ORCID_TOKEN_URL = `${import.meta.env.VITE_API_URL}/orcid/token`;
const MARKETPLACE_API_TOKEN = import.meta.env.VITE_MARKETPLACE_API_TOKEN;

interface OrcidUserData {
    orcid: string;
    name: string;
    email?: string;
}

export function useOrcidCallback() {
    const [userData, setUserData] = useState<OrcidUserData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const urlParams = new URLSearchParams(globalThis.location.search);
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
            const url = new URL(globalThis.location.href);
            url.searchParams.delete('code');
            globalThis.history.replaceState({}, document.title, url.pathname + url.search);
        })();
    }, [code]);

    async function loginWithOrcid(code: string): Promise<OrcidUserData> {
        try {
            const response = await axios.post(
                ORCID_TOKEN_URL,
                { code },
                {
                    headers: MARKETPLACE_API_TOKEN
                        ? { 'x-marketplace-token': MARKETPLACE_API_TOKEN }
                        : undefined
                }
            );

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
