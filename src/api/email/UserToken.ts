import axios from 'axios';

/**
 * requests a token for the user with the given email.
 * @param email - The email of the user to create.
 * @returns A promise resolving to the created user or false if creation fails.
 */
const userToken = async (email: string): Promise<string | boolean> => {

    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/request-login-code`,
            { email },
            {
                headers: import.meta.env.VITE_MARKETPLACE_API_TOKEN
                    ? { 'x-marketplace-token': import.meta.env.VITE_MARKETPLACE_API_TOKEN }
                    : undefined
            }
        );
        return response.data;

    } catch (error) {
        console.error('Email token request failed:', error);
        return false;
    }
};

export default userToken;
