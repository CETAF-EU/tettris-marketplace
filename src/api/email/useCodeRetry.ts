import { useEffect, useState } from 'react';
import type { CodeFailure } from './codeFeedback';

/** Advisory browser timer; the API remains the authority for every request. */
export function useCodeRetry() {
    const [retry, setRetry] = useState({ kind: '', until: 0 });
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const tick = () => setSeconds(Math.max(0, Math.ceil((retry.until - Date.now()) / 1000)));
        tick();
        if (!retry.until) return;
        const interval = window.setInterval(tick, 1000);
        return () => window.clearInterval(interval);
    }, [retry.until]);

    return {
        seconds,
        expired: retry.until > 0 && seconds === 0,
        locked: seconds > 0 && retry.kind === 'account_locked',
        requestBlocked: seconds > 0,
        apply: (failure: CodeFailure) => {
            if (failure.retryAfter > 0) {
                setRetry({ kind: failure.kind, until: Date.now() + failure.retryAfter * 1000 });
                setSeconds(failure.retryAfter);
            }
        },
        reset: () => {
            setRetry({ kind: '', until: 0 });
            setSeconds(0);
        },
    };
}
