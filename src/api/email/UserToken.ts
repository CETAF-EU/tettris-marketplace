import axios from 'axios';
import { codeFailure, type CodeResult } from './codeFeedback';

const requestUserToken = async (email: string): Promise<CodeResult> => {
    try {
        await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/request-login-code`,
            { email },
            { headers: import.meta.env.VITE_MARKETPLACE_API_TOKEN
                ? { 'x-marketplace-token': import.meta.env.VITE_MARKETPLACE_API_TOKEN }
                : undefined }
        );
        return { ok: true };
    } catch (error) {
        return codeFailure(error, 'Unable to send a verification code. Please try again.');
    }
};

export default requestUserToken;
