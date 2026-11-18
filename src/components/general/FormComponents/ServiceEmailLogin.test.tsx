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
        vi.mocked(requestUserToken).mockResolvedValue('Code sent');
        vi.mocked(verifyUserToken).mockResolvedValue(true);
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
        vi.mocked(requestUserToken).mockResolvedValue('Code sent');
        vi.mocked(verifyUserToken).mockResolvedValue(false);
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
        vi.mocked(requestUserToken).mockResolvedValue(false);
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
