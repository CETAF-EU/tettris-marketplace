import axios from 'axios';

export type ApiStatus = 'available' | 'unreachable' | 'request-failed';

/** HTTP errors demonstrate that the server responded, even if its operation failed. */
export function getApiRequestStatus(error: unknown): ApiStatus {
    if (axios.isAxiosError(error) && !error.response && error.request) {
        return 'unreachable';
    }
    return 'request-failed';
}
