import axios from 'axios';
import { clearStoredAuthToken, extractAuthToken, storeAuthToken } from 'api/auth/session';
import { codeFailure, type CodeResult } from './codeFeedback';

const verifyUserToken = async (email: string, code: string): Promise<CodeResult> => {
    clearStoredAuthToken();
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/login`,
            { email, code },
            { headers: import.meta.env.VITE_MARKETPLACE_API_TOKEN
                ? { 'x-marketplace-token': import.meta.env.VITE_MARKETPLACE_API_TOKEN }
                : undefined }
        );
        const token = extractAuthToken(response.data);
        if (!token) return codeFailure(null, 'The server did not return a valid login session.');
        storeAuthToken(token);
        return { ok: true };
    } catch (error) {
        clearStoredAuthToken();
        return codeFailure(error, 'Unable to verify your code. Please try again.');
    }
};

export default verifyUserToken;
