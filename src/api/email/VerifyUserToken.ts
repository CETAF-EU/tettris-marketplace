import axios from 'axios';

/**
 * Verifies a login token for the provided email.
 * @param email - The user email used to request the token.
 * @param code - The verification token received by the user.
 * @returns True when the token is accepted, false otherwise.
 */
const verifyUserToken = async (email: string, code: string): Promise<boolean> => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/login`,
            { email, code },
            {
                headers: import.meta.env.VITE_MARKETPLACE_API_TOKEN
                    ? { 'x-marketplace-token': import.meta.env.VITE_MARKETPLACE_API_TOKEN }
                    : undefined
            }
        );

        if (typeof response.data === 'boolean') {
            return response.data;
        }

        if (response.data && typeof response.data.success === 'boolean') {
            return response.data.success;
        }

        return Boolean(response.data);
    } catch (error) {
        console.error('Email token verification failed:', error);
        return false;
    }
};

export default verifyUserToken;
