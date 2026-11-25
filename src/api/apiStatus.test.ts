import { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';
import { getApiRequestStatus } from './apiStatus';

describe('API request status', () => {
    it.each([401, 403, 404, 422, 500, 503])('does not call an HTTP %i response an offline API', status => {
        const error = new AxiosError('HTTP failure');
        Object.assign(error, { response: { status }, request: {} });
        expect(getApiRequestStatus(error)).toBe('request-failed');
    });

    it('recognizes a network failure without an HTTP response', () => {
        const error = new AxiosError('Network error');
        Object.assign(error, { request: {} });
        expect(getApiRequestStatus(error)).toBe('unreachable');
    });

    it('does not confuse client-side errors with an unreachable API', () => {
        expect(getApiRequestStatus(new Error('Unexpected response'))).toBe('request-failed');
    });
});
