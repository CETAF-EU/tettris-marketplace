const AUTH_TOKEN_STORAGE_KEY = 'marketplace-auth-token';

type AuthPayload = {
    token?: string;
    bearerToken?: string;
    accessToken?: string;
    access_token?: string;
    jwt?: string;
    data?: AuthPayload;
    result?: AuthPayload;
    success?: boolean;
};

const getStorage = (): Storage | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    return window.localStorage;
};

export const getStoredAuthToken = (): string | null => {
    return getStorage()?.getItem(AUTH_TOKEN_STORAGE_KEY) ?? null;
};

export const storeAuthToken = (token: string): void => {
    getStorage()?.setItem(AUTH_TOKEN_STORAGE_KEY, token);
};

export const clearStoredAuthToken = (): void => {
    getStorage()?.removeItem(AUTH_TOKEN_STORAGE_KEY);
};

export const extractAuthToken = (payload: unknown): string | null => {
    if (!payload || typeof payload !== 'object') {
        return null;
    }

    const {
        token,
        bearerToken,
        accessToken,
        access_token: accessTokenSnakeCase,
        jwt,
        data,
        result
    } = payload as AuthPayload;

    return token
        ?? bearerToken
        ?? accessToken
        ?? accessTokenSnakeCase
        ?? jwt
        ?? extractAuthToken(data)
        ?? extractAuthToken(result)
        ?? null;
};
