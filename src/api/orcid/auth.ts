import { useEffect, useState } from 'react';
import axios from 'axios';
import checkIfOrcidExists from './checkIfOrcidExists';
import { clearStoredAuthToken, extractAuthToken, storeAuthToken } from 'api/auth/session';
import { TaxonomicExpert, Dict } from 'app/Types';

const ORCID_TOKEN_URL = `${import.meta.env.VITE_API_URL}/orcid/token`;
const MARKETPLACE_API_TOKEN = import.meta.env.VITE_MARKETPLACE_API_TOKEN;

interface OrcidUserData {
    orcid: string;
    name: string;
    email?: string;
}

interface OrcidLoginResult {
    userData: OrcidUserData;
    existingExpert: TaxonomicExpert | null;
}

type ExpertEmailDataResponse = {
    taxonomic_expert?: Dict;
    taxonomicExpert?: Dict;
    user_email?: string;
    email_source?: string;
};

export function useOrcidCallback() {
    const [userData, setUserData] = useState<OrcidUserData | null>(null);
    const [existingExpert, setExistingExpert] = useState<TaxonomicExpert | null>(null);
    const [error, setError] = useState<string | null>(null);

    const urlParams = new URLSearchParams(globalThis.location.search);
    const code = urlParams.get('code');

    useEffect(() => {
        if (!code) return;

        (async () => {
            try {
                const data = await loginWithOrcid(code);
                setUserData(data.userData);
                setExistingExpert(data.existingExpert);
            } catch (err: any) {
                setError(err.message);
            }

            // Remove 'code' param from URL
            const url = new URL(globalThis.location.href);
            url.searchParams.delete('code');
            globalThis.history.replaceState({}, document.title, url.pathname + url.search);
        })();
    }, [code]);

    const resolveExpertId = (expert: TaxonomicExpert | null): string | null => {
        if (!expert) {
            return null;
        }

        const candidate = expert as unknown as Dict;
        const expertRecord = (
            candidate.taxonomicExpert
            ?? candidate.taxonomic_expert
            ?? candidate.attributes?.content?.taxonomicExpert
            ?? candidate.attributes?.content?.taxonomic_expert
            ?? candidate.attributes?.content
            ?? candidate
        ) as Dict | undefined;

        const resolvedId = (
            expertRecord?.['@id']
            ?? candidate.id
            ?? candidate['@id']
            ?? candidate.attributes?.id
        );

        return typeof resolvedId === 'string' && resolvedId.trim().length > 0
            ? resolvedId
            : null;
    };

    const fetchExpertEmailData = async (expertId: string, accessToken: string): Promise<string | null> => {
        try {
            const response = await axios.get<ExpertEmailDataResponse>(
                `${import.meta.env.VITE_API_URL}/cordra/experts/${encodeURIComponent(expertId)}/email-data`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        ...(MARKETPLACE_API_TOKEN ? { 'x-marketplace-token': MARKETPLACE_API_TOKEN } : {}),
                    },
                }
            );

            const payload = response.data;
            const expertContainer = payload.taxonomic_expert ?? payload.taxonomicExpert;
            const expertRecord = (
                expertContainer?.taxonomicExpert
                ?? expertContainer?.taxonomic_expert
                ?? expertContainer
            ) as Dict | undefined;
            const person = (expertRecord?.['schema:person'] ?? expertRecord?.person) as Dict | undefined;
            const emailFromPerson = person?.['schema:email'] ?? person?.email;

            if (typeof emailFromPerson === 'string' && emailFromPerson.trim().length > 0) {
                return emailFromPerson.trim();
            }

            const userEmail = payload.user_email;
            if (typeof userEmail === 'string' && userEmail.trim().length > 0 && !userEmail.endsWith('@orcid.invalid')) {
                return userEmail.trim();
            }

            return null;
        } catch (error) {
            console.error('Failed to retrieve expert email-data:', error);
            return null;
        }
    };

    async function loginWithOrcid(code: string): Promise<OrcidLoginResult> {
        try {
            clearStoredAuthToken();

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

            const authToken = extractAuthToken(response.data);
            if (authToken) {
                storeAuthToken(authToken);
            }

            // ORCID response has structure: { access_token, token_type, user: { id, email, is_verified, ... } }
            // The ORCID is stored in user.email as "ORCID@orcid.invalid"
            const userData_obj = (response.data as Record<string, unknown>).user as Record<string, unknown> | undefined;
            
            if (!userData_obj) {
                throw new Error('User data not found in token response');
            }

            // Extract ORCID from email field (format: "0009-0004-5632-8045@orcid.invalid")
            const emailFromUser = userData_obj.email as string | undefined;
            const orcidValue = emailFromUser?.replace('@orcid.invalid', '').trim() ?? null;
            
            // Try to get name from user object (if available)
            const nameValue = (userData_obj.name as string) ?? (userData_obj['schema:name'] as string) ?? '';
            
            if (!orcidValue || typeof orcidValue !== 'string') {
                throw new Error('ORCID not found in token response');
            }

            const userData: OrcidUserData = {
                orcid: orcidValue,
                name: typeof nameValue === 'string' ? nameValue : '',
                ...(typeof userData_obj.email === 'string' && !userData_obj.email.includes('@orcid.invalid') ? { email: userData_obj.email } : {}),
            };
            
            const existingExpert = await checkIfOrcidExists(userData.orcid);
            const expertId = resolveExpertId(existingExpert);
            const resolvedEmail = expertId && authToken
                ? await fetchExpertEmailData(expertId, authToken)
                : null;

            const userDataWithEmail: OrcidUserData = resolvedEmail
                ? { ...userData, email: resolvedEmail }
                : userData;

            return {
                userData: userDataWithEmail,
                existingExpert
            };
        } catch (error: any) {
            clearStoredAuthToken();
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message ?? 'Failed to login with ORCID');
            }

            console.error('Unexpected ORCID login error:', error);
            throw new Error('Failed to login with ORCID');
        }
    }

    return { userData, existingExpert, error };
}
