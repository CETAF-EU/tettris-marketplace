import axios from 'axios';
import { extractAuthToken, getStoredAuthToken, storeAuthToken } from './session';

type LinkedUser = {
    orcid_id?: string | null;
    email?: string;
};

type LinkedAuthResponse = {
    access_token?: string;
    user?: LinkedUser;
};

/**
 * Exchanges an email code together with the existing ORCID bearer token.
 * Only the backend can issue a signed identity containing both claims.
 * Never replace the ORCID token with a standalone email-login token.
 */
const linkOrcidEmail = async (
    email: string,
    code: string,
    expectedOrcid: string
): Promise<boolean> => {
    const currentToken = getStoredAuthToken();
    if (!currentToken || !expectedOrcid) {
        throw new Error('Please sign in with ORCID before verifying your email.');
    }

    const response = await axios.post<LinkedAuthResponse>(
        `${import.meta.env.VITE_API_URL}/auth/link-orcid-email`,
        { email, code },
        {
            headers: {
                Authorization: `Bearer ${currentToken}`,
                ...(import.meta.env.VITE_MARKETPLACE_API_TOKEN
                    ? { 'x-marketplace-token': import.meta.env.VITE_MARKETPLACE_API_TOKEN }
                    : {}),
            },
        }
    );

    const updatedToken = extractAuthToken(response.data);
    const verifiedUser = response.data?.user;
    if (
        !updatedToken ||
        !verifiedUser ||
        verifiedUser.orcid_id?.toUpperCase() !== expectedOrcid.toUpperCase() ||
        verifiedUser.email?.toLowerCase() !== email.trim().toLowerCase()
    ) {
        throw new Error('The verified identity did not match this ORCID login.');
    }

    storeAuthToken(updatedToken);
    return true;
};

export default linkOrcidEmail;
