import axios from 'axios';

export type CodeFailure = { ok: false; message: string; kind: string; retryAfter: number };
export type CodeResult = { ok: true } | CodeFailure;

export function codeFailure(error: unknown, fallback: string): CodeFailure {
    if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;
        const status = error.response?.status;
        if (status === 429) {
            const structured = detail && typeof detail === 'object' ? detail : null;
            const seconds = Number(structured?.retry_after ?? error.response?.headers?.['retry-after'] ?? 60);
            return {
                ok: false,
                kind: typeof structured?.code === 'string' ? structured.code : 'rate_limit',
                message: typeof structured?.message === 'string' ? structured.message : 'Too many requests. Please wait before trying again.',
                retryAfter: Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds) : 60,
            };
        }
        if (status === 401) return { ok: false, kind: 'invalid_code', message: 'Invalid or expired verification code.', retryAfter: 0 };
        if (status === 422) return { ok: false, kind: 'invalid_input', message: 'Enter a valid email address and verification code.', retryAfter: 0 };
        if (status === 503) return { ok: false, kind: 'unavailable', message: 'The verification service is temporarily unavailable. Please try again later.', retryAfter: 0 };
    }
    return { ok: false, kind: 'request_failed', message: fallback, retryAfter: 0 };
}
