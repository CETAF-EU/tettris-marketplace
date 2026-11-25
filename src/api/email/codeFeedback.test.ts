import { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';
import { codeFailure } from './codeFeedback';

function error(status: number, detail: unknown, headers = {}) {
    const result = new AxiosError('request failed');
    Object.assign(result, { response: { status, data: { detail }, headers } });
    return result;
}

describe('email code feedback', () => {
    it.each(['account_locked', 'resend_cooldown', 'recipient_limit', 'global_limit'])('preserves %s and its retry deadline', kind => {
        expect(codeFailure(error(429, { code: kind, message: 'No new code was sent.', retry_after: 85 }), 'fallback')).toEqual({
            ok: false, kind, message: 'No new code was sent.', retryAfter: 85,
        });
    });
    it('uses the retry header for legacy rate limits', () => {
        expect(codeFailure(error(429, 'Too many requests', { 'retry-after': '45' }), 'fallback').retryAfter).toBe(45);
    });
    it('distinguishes invalid codes from delivery failures', () => {
        expect(codeFailure(error(401, 'invalid'), 'fallback').kind).toBe('invalid_code');
        expect(codeFailure(error(503, 'unavailable'), 'fallback').kind).toBe('unavailable');
    });
    it('does not display arbitrary network error text', () => {
        expect(codeFailure(new Error('private diagnostics'), 'Try again').message).toBe('Try again');
    });
});
