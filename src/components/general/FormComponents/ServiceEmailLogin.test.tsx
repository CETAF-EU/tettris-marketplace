import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import requestUserToken from 'api/email/UserToken';
import verifyUserToken from 'api/email/VerifyUserToken';
import ServiceEmailLogin from './ServiceEmailLogin';

vi.mock('api/email/UserToken', () => ({ default: vi.fn() }));
vi.mock('api/email/VerifyUserToken', () => ({ default: vi.fn() }));

describe('taxonomic service email-code login', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('requests an email code, then permits access only after verification', async () => {
        vi.mocked(requestUserToken).mockResolvedValue({ ok: true });
        vi.mocked(verifyUserToken).mockResolvedValue({ ok: true });
        const allowed = vi.fn();
        render(<ServiceEmailLogin onVerified={allowed} />);

        fireEvent.change(screen.getByLabelText('Email address'), {
            target: { value: 'researcher@example.invalid' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Send verification code' }));
        await waitFor(() => expect(requestUserToken).toHaveBeenCalledWith('researcher@example.invalid'));
        expect(allowed).not.toHaveBeenCalled();

        fireEvent.change(screen.getByLabelText('Verification code'), { target: { value: '123456' } });
        fireEvent.click(screen.getByRole('button', { name: 'Verify code' }));
        await waitFor(() =>
            expect(verifyUserToken).toHaveBeenCalledWith('researcher@example.invalid', '123456'),
        );
        await waitFor(() => expect(allowed).toHaveBeenCalledOnce());
    });

    it('never unlocks the form when email verification fails', async () => {
        vi.mocked(requestUserToken).mockResolvedValue({ ok: true });
        vi.mocked(verifyUserToken).mockResolvedValue({ ok: false, kind: 'invalid_code', message: 'Verification failed', retryAfter: 0 });
        const allowed = vi.fn();
        render(<ServiceEmailLogin onVerified={allowed} />);

        fireEvent.change(screen.getByLabelText('Email address'), {
            target: { value: 'researcher@example.invalid' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Send verification code' }));
        await screen.findByLabelText('Verification code');
        fireEvent.change(screen.getByLabelText('Verification code'), { target: { value: '000000' } });
        fireEvent.click(screen.getByRole('button', { name: 'Verify code' }));

        await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
        expect(allowed).not.toHaveBeenCalled();
    });

    it('does not permit access when the code request could not be sent', async () => {
        vi.mocked(requestUserToken).mockResolvedValue({ ok: false, kind: 'invalid_code', message: 'Verification failed', retryAfter: 0 });
        const allowed = vi.fn();
        render(<ServiceEmailLogin onVerified={allowed} />);
        fireEvent.change(screen.getByLabelText('Email address'), {
            target: { value: 'researcher@example.invalid' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Send verification code' }));
        await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
        expect(screen.queryByLabelText('Verification code')).toBeNull();
        expect(allowed).not.toHaveBeenCalled();
    });
});

describe('email-code lockout and resend feedback', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        vi.mocked(requestUserToken).mockResolvedValue({ ok: true });
    });

    async function begin() {
        render(<ServiceEmailLogin onVerified={vi.fn()} />);
        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'test@example.invalid' } });
        fireEvent.click(screen.getByRole('button', { name: 'Send verification code' }));
        await screen.findByLabelText('Verification code');
    }

    it('shows lockout and disables verification and resend', async () => {
        vi.mocked(verifyUserToken).mockResolvedValue({
            ok: false, kind: 'account_locked', message: 'Your email is temporarily locked.', retryAfter: 900,
        });
        await begin();
        fireEvent.change(screen.getByLabelText('Verification code'), { target: { value: '123456' } });
        fireEvent.click(screen.getByRole('button', { name: 'Verify code' }));
        expect(await screen.findByRole('alert')).toHaveTextContent('temporarily locked');
        expect(screen.getByRole('alert')).toHaveTextContent('Try again in');
        expect(screen.getByRole('button', { name: 'Verify code' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Resend code' })).toBeDisabled();
        expect(screen.queryByText('Verification code sent. Check your email inbox.')).not.toBeInTheDocument();
    });

    it('does not claim delivery when resend was refused', async () => {
        await begin();
        vi.mocked(requestUserToken).mockResolvedValue({
            ok: false, kind: 'resend_cooldown', message: 'No new code was sent.', retryAfter: 60,
        });
        fireEvent.click(screen.getByRole('button', { name: 'Resend code' }));
        expect(await screen.findByRole('alert')).toHaveTextContent('No new code was sent.');
        expect(screen.queryByText('Verification code sent. Check your email inbox.')).not.toBeInTheDocument();
        await waitFor(() => expect(screen.getByRole('button', { name: 'Verify code' })).toBeEnabled());
        expect(screen.getByRole('button', { name: 'Resend code' })).toBeDisabled();
    });
});
