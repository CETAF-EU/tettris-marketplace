import { useState, type FormEvent } from 'react';

import requestUserToken from 'api/email/UserToken';
import verifyUserToken from 'api/email/VerifyUserToken';

type Props = {
    onVerified: () => void;
};

/**
 * Service proposals require the same verified email bearer token as expert
 * registrations. This gate is separate from expert registration session data.
 */
const ServiceEmailLogin = ({ onVerified }: Props) => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [codeRequested, setCodeRequested] = useState(false);
    const [working, setWorking] = useState(false);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');

    const requestCode = async (targetEmail: string) => {
        const sent = await requestUserToken(targetEmail);
        if (!sent) {
            setError('Unable to send your verification code. Please try again.');
            return false;
        }
        setCodeRequested(true);
        setError('');
        setInfo('Verification code sent. Check your email inbox.');
        return true;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (working) return;
        setWorking(true);
        setError('');
        try {
            if (!codeRequested) {
                await requestCode(email.trim());
            } else {
                const verified = await verifyUserToken(email.trim(), code.trim());
                if (!verified) {
                    setError('Invalid or expired code. Check your email and try again.');
                } else {
                    onVerified();
                }
            }
        } catch {
            setError('Unable to verify your email. Please try again.');
        } finally {
            setWorking(false);
        }
    };

    return (
        <section className="mt-3" aria-label="Verify your email for service registration">
            <div className="card w-100 px-4 py-3">
                <h2 className="fs-4">Verify your email to suggest a taxonomic service</h2>
                <p>A verification code is required before you can submit a service proposal.</p>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="serviceLoginEmail" className="form-label">Email address</label>
                    <input
                        id="serviceLoginEmail"
                        type="email"
                        className="form-control mb-3"
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        disabled={codeRequested || working}
                        required
                    />
                    {codeRequested && (
                        <>
                            <label htmlFor="serviceLoginCode" className="form-label">Verification code</label>
                            <input
                                id="serviceLoginCode"
                                className="form-control mb-3"
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                minLength={6}
                                maxLength={6}
                                value={code}
                                onChange={(event) => setCode(event.target.value)}
                                required
                            />
                        </>
                    )}
                    <button type="submit" className="btn btn-primary" disabled={working}>
                        {working ? 'Please wait...' : (codeRequested ? 'Verify code' : 'Send verification code')}
                    </button>
                    {codeRequested && (
                        <>
                            <button
                                type="button"
                                className="btn btn-link ms-2"
                                disabled={working}
                                onClick={async () => {
                                    setWorking(true);
                                    try {
                                        await requestCode(email.trim());
                                    } finally {
                                        setWorking(false);
                                    }
                                }}
                            >
                                Resend code
                            </button>
                            <button
                                type="button"
                                className="btn btn-link ms-2"
                                disabled={working}
                                onClick={() => {
                                    setCodeRequested(false);
                                    setCode('');
                                    setError('');
                                    setInfo('');
                                }}
                            >
                                Use another email
                            </button>
                        </>
                    )}
                    {info && <p className="text-success mt-3" role="status">{info}</p>}
                    {error && <p className="text-danger mt-3" role="alert">{error}</p>}
                </form>
            </div>
        </section>
    );
};

export default ServiceEmailLogin;
