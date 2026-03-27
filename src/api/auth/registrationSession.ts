import type { Dict, TaxonomicExpert } from 'app/Types';

export type RegistrationLoginMethod = 'email' | 'orcid';

export type RegistrationOrcidUserData = {
    orcid?: string;
    name?: string;
    email?: string;
};

export type RegistrationSessionState = {
    completed?: boolean;
    draftValues?: Dict;
    expertProfile?: TaxonomicExpert | null;
    isLoggedIn?: boolean;
    loginMethod?: RegistrationLoginMethod;
    moreLogin?: boolean;
    orcidUserData?: RegistrationOrcidUserData | null;
    pendingEmail?: string;
    tokenRequested?: boolean;
    verifiedEmail?: string;
};

const REGISTRATION_SESSION_STORAGE_KEY = 'marketplace-registration-session';

const getStorage = (): Storage | null => {
    if (globalThis.window === undefined) {
        return null;
    }

    return globalThis.window.sessionStorage;
};

export const getRegistrationSession = (): RegistrationSessionState => {
    const rawValue = getStorage()?.getItem(REGISTRATION_SESSION_STORAGE_KEY);
    if (!rawValue) {
        return {};
    }

    try {
        const parsedValue = JSON.parse(rawValue) as RegistrationSessionState;
        return parsedValue && typeof parsedValue === 'object' ? parsedValue : {};
    } catch {
        return {};
    }
};

export const setRegistrationSession = (value: RegistrationSessionState): void => {
    getStorage()?.setItem(REGISTRATION_SESSION_STORAGE_KEY, JSON.stringify(value));
};

export const updateRegistrationSession = (value: Partial<RegistrationSessionState>): RegistrationSessionState => {
    const nextValue = {
        ...getRegistrationSession(),
        ...value,
    };

    setRegistrationSession(nextValue);
    return nextValue;
};

export const clearRegistrationSession = (): void => {
    getStorage()?.removeItem(REGISTRATION_SESSION_STORAGE_KEY);
};
