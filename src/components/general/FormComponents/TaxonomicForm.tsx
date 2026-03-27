import { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

/* Import Sources */
import TaxonomicExpertFormJSON from 'sources/forms/TaxonomicExpertForm.json';
import TaxonomicServiceFormJSON from 'sources/forms/TaxonomicServiceForm.json';

/* Import Components */
import Header from 'components/general/header/Header';
import Footer from 'components/general/footer/Footer';
import { BreadCrumbs } from 'components/general/CustomComponents';
import FormBuilder from 'components/general/FormComponents/FormBuilder';
import { Color, getColor } from '../ColorPage';
import { useOrcidCallback } from 'api/orcid/auth';
import checkIfEmailExists from 'api/email/checkIfEmailExists';
import requestUserToken from 'api/email/UserToken';
import verifyUserToken from 'api/email/VerifyUserToken.ts';
import { Dict, TaxonomicExpert } from 'app/Types';
import { cloneDeep } from 'lodash';
import {
    clearRegistrationSession,
    getRegistrationSession,
    RegistrationLoginMethod,
    RegistrationOrcidUserData,
    updateRegistrationSession
} from 'api/auth/registrationSession';

const EMAIL_JSON_PATH = "$['schema:person']['schema:email']";
const NAME_JSON_PATH = "$['schema:person']['schema:name']";
const ORCID_JSON_PATH = "$['schema:person']['schema:orcid']";

const getExpertDraftValues = (expert: TaxonomicExpert | null): Dict => {
    if (!expert) {
        return {};
    }

    const candidate = expert as unknown as Dict;
    const expertRecord = (
        candidate.taxonomicExpert
        ?? candidate.taxonomic_expert
        ?? candidate.attributes?.content?.taxonomicExpert
        ?? candidate.attributes?.content?.taxonomic_expert
        ?? candidate.attributes?.content
        ?? candidate
    ) as Dict | undefined;

    if (!expertRecord || typeof expertRecord !== 'object') {
        return {};
    }

    return cloneDeep(expertRecord);
};

const TaxonomicForm = () => {
    const [completed, setCompleted] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [moreLogin, setMoreLogin] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [expertExists, setExpertExists] = useState<TaxonomicExpert | null>(null);
    const [loginError, setLoginError] = useState<string>('');
    const [loginInfo, setLoginInfo] = useState<string>('');
    const [pendingEmail, setPendingEmail] = useState<string>('');
    const [tokenRequested, setTokenRequested] = useState<boolean>(false);
    const [isResendingToken, setIsResendingToken] = useState<boolean>(false);
    const [loginMethod, setLoginMethod] = useState<RegistrationLoginMethod | null>(null);
    const [orcidUserData, setOrcidUserData] = useState<RegistrationOrcidUserData | null>(null);
    const [isSessionHydrated, setIsSessionHydrated] = useState<boolean>(!globalThis.location.pathname.includes('/te'));
    const [isSessionSyncEnabled, setIsSessionSyncEnabled] = useState<boolean>(true);

    const { userData, existingExpert: orcidCallbackExpert, isLoading: isOrcidCallbackLoading, error } = useOrcidCallback();

    const isExpertForm = globalThis.location.pathname.includes('/te');

    const title = isExpertForm
        ? 'Register as a new taxonomic expert'
        : 'Suggest a new taxonomic e-service';

    const description = isExpertForm
        ? 'Welcome to the Taxonomic Expert form. This registration form allows you to create a public profile in the CETAF Taxonomic e-Service and Expertise Marketplace.\n\nFor each field, we explain why the information is requested and how it will be used. The information you provide is intended to help others discover, understand and contact taxonomic experts and service providers.\n\nParticipation is voluntary. You will be asked to give explicit consent before submitting your profile.'
        : 'Use this form to suggest new taxonomic e-services or tools that should be listed in the CETAF Marketplace.\nPlease fill in the required fields and add as much additional information as you can.\nThe CETAF secretariat will review and curate your submission before adding it to the marketplace.\nTo be accepted it needs to be a taxonomic tool or service and it needs to be of sufficient quality\nPlease propose only services that are in production and maintained.';

    const sended = isExpertForm
        ? 'Your submission is received and will be processed by the Marketplace! A CETAF administrator will review the request. The review can take up to 5 working days. Your profile will be published on the Marketplace once the review is completed.\nThank you for using the Taxonomic Marketplace!'
        : 'Your submission is received and will be processed by the Marketplace! A CETAF administrator will review and score the taxonomic service. When the score is sufficient, the service will be published in the Marketplace catalog.\nThank you for using the Taxonomic Marketplace!';

    const formTemplate = isExpertForm ? TaxonomicExpertFormJSON : TaxonomicServiceFormJSON;
    const color = `fs-2 tc-${getColor(globalThis.location)}` as Color;
    const submissionHeading = completed ? 'Submission received' : title;
    const submissionDescription = completed ? sended : description;

    useEffect(() => {
        if (!isExpertForm) {
            return;
        }

        const sessionState = getRegistrationSession();
        setCompleted(sessionState.completed === true);
        setIsLoggedIn(sessionState.isLoggedIn === true);
        setMoreLogin(sessionState.moreLogin === true);
        setEmail(sessionState.verifiedEmail ?? '');
        setExpertExists(sessionState.expertProfile ?? null);
        setPendingEmail(sessionState.pendingEmail ?? '');
        setTokenRequested(sessionState.tokenRequested === true);
        setLoginMethod(sessionState.loginMethod ?? null);
        setOrcidUserData(sessionState.orcidUserData ?? null);
        setIsSessionHydrated(true);
    }, [isExpertForm]);

    useEffect(() => {
        if (!isExpertForm || !isSessionHydrated || !isSessionSyncEnabled) {
            return;
        }

        updateRegistrationSession({
            completed,
            expertProfile: expertExists,
            isLoggedIn,
            loginMethod: loginMethod ?? undefined,
            moreLogin,
            orcidUserData,
            pendingEmail,
            tokenRequested,
            verifiedEmail: email,
        });
    }, [completed, email, expertExists, isExpertForm, isLoggedIn, isSessionHydrated, isSessionSyncEnabled, loginMethod, moreLogin, orcidUserData, pendingEmail, tokenRequested]);

    useEffect(() => {
        if (!userData || isOrcidCallbackLoading) {
            return;
        }

        const applyValidatedOrcidLogin = async () => {
            const existingOrcidExpert = orcidCallbackExpert;
            const draftValues = getExpertDraftValues(existingOrcidExpert);

            setOrcidUserData(userData);
            setEmail(userData.email ?? '');
            setExpertExists(existingOrcidExpert);
            setIsLoggedIn(true);
            setLoginMethod('orcid');
            setTokenRequested(false);
            setPendingEmail('');
            setLoginError('');
            setLoginInfo('');

            updateRegistrationSession({
                draftValues,
                expertProfile: existingOrcidExpert,
                isLoggedIn: true,
                loginMethod: 'orcid',
                orcidUserData: userData,
                pendingEmail: '',
                tokenRequested: false,
                verifiedEmail: userData.email,
            });
        };

        void applyValidatedOrcidLogin().catch(() => {
            setLoginError('Unable to validate ORCID profile. Please try again.');
        });
    }, [isOrcidCallbackLoading, orcidCallbackExpert, userData]);

    const redirectToOrcidAuth = () => {
        const orcidAuthUrl = `https://orcid.org/oauth/authorize?client_id=${import.meta.env.VITE_ORCID_CLIENT_ID}&response_type=code&scope=/authenticate&redirect_uri=${import.meta.env.VITE_ORCID_REDIRECT_URI}`;
        globalThis.location.href = orcidAuthUrl;
    };

    const handleGoBackToExpertSearch = () => {
        clearRegistrationSession();
        globalThis.location.href = '/search?serviceType=taxonomicExpert';
    };

    const handleClearOrcidSession = () => {
        clearRegistrationSession();
        setIsSessionSyncEnabled(true);
        setCompleted(false);
        setIsLoggedIn(false);
        setMoreLogin(false);
        setEmail('');
        setExpertExists(null);
        setLoginError('');
        setLoginInfo('');
        setPendingEmail('');
        setTokenRequested(false);
        setIsResendingToken(false);
        setLoginMethod(null);
        setOrcidUserData(null);
    };

    const handleSubmissionCompleted = () => {
        setCompleted(true);

        if (!isExpertForm) {
            return;
        }

        setIsSessionSyncEnabled(false);
        clearRegistrationSession();
    };

    const handleResendToken = async () => {
        if (!pendingEmail) {
            setLoginError('No email available to resend the token.');
            return;
        }

        setIsResendingToken(true);
        const tokenRequestSucceeded = await requestUserToken(pendingEmail);
        setIsResendingToken(false);

        if (!tokenRequestSucceeded) {
            setLoginError('Unable to resend verification token. Please try again later.');
            return;
        }

        setLoginError('');
        setLoginInfo('A new verification token has been sent. Check your email inbox.');
    };

    const lockedFieldValues = useMemo<Record<string, unknown>>(() => {
        const lockedValues: Record<string, unknown> = {};

        if (loginMethod === 'email' && email) {
            lockedValues[EMAIL_JSON_PATH] = email;
        }

        if (loginMethod === 'orcid') {
            if (orcidUserData?.orcid) {
                lockedValues[ORCID_JSON_PATH] = orcidUserData.orcid;
            }
            if (orcidUserData?.email) {
                lockedValues[EMAIL_JSON_PATH] = orcidUserData.email;
            }
            if (orcidUserData?.name) {
                lockedValues[NAME_JSON_PATH] = orcidUserData.name;
            }
        }

        return lockedValues;
    }, [email, loginMethod, orcidUserData]);

    const currentOrcidEmail = orcidUserData?.email ?? email;
    const hasVerifiedOrcidEmail = typeof currentOrcidEmail === 'string' && currentOrcidEmail.trim() !== '';
    const hasExistingOrcidProfile = expertExists !== null;
    const requiresOrcidEmailVerification = isExpertForm
        && isLoggedIn
        && loginMethod === 'orcid'
        && !hasExistingOrcidProfile
        && !hasVerifiedOrcidEmail;

    const handleOrcidEmailVerificationSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget;
        const emailInput = form.elements.namedItem('orcidEmail') as HTMLInputElement | null;
        const emailConfirmInput = form.elements.namedItem('orcidEmailConfirm') as HTMLInputElement | null;
        const tokenInput = form.elements.namedItem('orcidEmailToken') as HTMLInputElement | null;
        const emailValue = emailInput?.value.trim() ?? '';
        const emailConfirmValue = emailConfirmInput?.value.trim() ?? '';
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

        if (tokenRequested) {
            const tokenValue = tokenInput?.value.trim() || '';
            if (!tokenValue) {
                setLoginError('Please enter the verification token.');
                return;
            }

            const isTokenValid = await verifyUserToken(pendingEmail, tokenValue);
            if (!isTokenValid) {
                setLoginError('Invalid or expired token. Please try again.');
                return;
            }

            const updatedOrcidUserData: RegistrationOrcidUserData = orcidUserData
                ? { ...orcidUserData, email: pendingEmail }
                : { email: pendingEmail };

            setOrcidUserData(updatedOrcidUserData);
            setEmail(pendingEmail);
            setTokenRequested(false);
            setPendingEmail('');
            setLoginError('');
            setLoginInfo('');

            updateRegistrationSession({
                orcidUserData: updatedOrcidUserData,
                pendingEmail: '',
                tokenRequested: false,
                verifiedEmail: pendingEmail,
            });
            return;
        }

        if (!emailValid) {
            setLoginError('Invalid email.');
            return;
        }

        if (emailValue !== emailConfirmValue) {
            setLoginError('Email addresses do not match.');
            return;
        }

        const existingEmailExpert = await checkIfEmailExists(emailValue);
        if (existingEmailExpert) {
            setLoginError('This email is already registered in the Marketplace. Please use another email.');
            return;
        }

        const tokenRequestSucceeded = await requestUserToken(emailValue);
        if (!tokenRequestSucceeded) {
            setLoginError('Unable to send verification token. Please try again later.');
            return;
        }

        setPendingEmail(emailValue);
        setTokenRequested(true);
        setLoginError('');
        setLoginInfo('Verification token sent. Check your email and enter the token below.');

        updateRegistrationSession({
            pendingEmail: emailValue,
            tokenRequested: true,
        });
    };

    return (
        <div className="h-100 d-flex flex-column">
            <Header />

            <Container fluid className="flex-grow-1 overflow-scroll">
                <Row className="h-100">
                    <Col xs={{ span: 10, offset: 1 }} lg={{ span: 6, offset: 3 }} className="h-100 pt-4 pt-lg-5 pb-4">
                        <Row>
                            <Col>
                                <BreadCrumbs />
                            </Col>
                        </Row>
                        {isExpertForm && !isLoggedIn && (
                            <Col>
                                <Row>
                                    <Col>
                                        <p className="fs-4 mt-3">
                                            Use this form to register as a taxonomic expert for the Marketplace. If your email or ORCID already exists, your previously submitted profile will be loaded so you can update it.
                                        </p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Card className="w-100 px-4 py-3 mt-3">
                                            <Row>
                                                <Col>
                                                    <h2 className="fs-4">Login with ORCID</h2>
                                                    <p className="mt-2">
                                                        To proceed, please log in using your ORCID account. This ensures that your submission is linked to your professional profile.
                                                    </p>
                                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={redirectToOrcidAuth}
                                                            type="button"
                                                        >
                                                            Login with ORCID
                                                        </button>
                                                        <button
                                                            className="btn btn-link p-0 ms-2"
                                                            style={{ fontSize: '0.95rem' }}
                                                            onClick={() => setMoreLogin((currentValue) => !currentValue)}
                                                            type="button"
                                                        >
                                                            more
                                                        </button>
                                                    </div>
                                                    {error && <p className="text-danger mt-3">{error}</p>}
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                </Row>
                            </Col>
                        )}
                        {moreLogin && isExpertForm && !isLoggedIn && (
                            <Row className="my-3">
                                <Col>
                                    <div className="d-flex align-items-center justify-content-center">
                                        <hr className="flex-grow-1" />
                                        <span className="mx-3 text-muted">or</span>
                                        <hr className="flex-grow-1" />
                                    </div>
                                </Col>
                            </Row>
                        )}
                        {moreLogin && isExpertForm && !isLoggedIn && (
                            <Row className="mt-3">
                                <Col>
                                    <Card className="w-100 px-4 py-3">
                                        <Row>
                                            <Col>
                                                <div>
                                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                                        <h2 className="fs-4 mb-0">Register with an Email</h2>
                                                    </div>
                                                    <form
                                                        onSubmit={async (event) => {
                                                            event.preventDefault();

                                                            const form = event.currentTarget;
                                                            const emailInput = form.elements.namedItem('email') as HTMLInputElement | null;
                                                            const emailConfirmInput = form.elements.namedItem('emailConfirm') as HTMLInputElement | null;
                                                            const tokenInput = form.elements.namedItem('token') as HTMLInputElement | null;
                                                            const emailValue = emailInput?.value.trim() ?? '';
                                                            const emailConfirmValue = emailConfirmInput?.value.trim() ?? '';
                                                            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

                                                            if (tokenRequested) {
                                                                const tokenValue = tokenInput?.value.trim() || '';
                                                                if (!tokenValue) {
                                                                    setLoginError('Please enter the verification token.');
                                                                    return;
                                                                }

                                                                const isTokenValid = await verifyUserToken(pendingEmail, tokenValue);
                                                                if (!isTokenValid) {
                                                                    setLoginError('Invalid or expired token. Please try again.');
                                                                    return;
                                                                }

                                                                setEmail(pendingEmail);
                                                                setIsLoggedIn(true);
                                                                setLoginMethod('email');
                                                                setTokenRequested(false);
                                                                setPendingEmail('');
                                                                setLoginError('');
                                                                setLoginInfo('');

                                                                updateRegistrationSession({
                                                                    isLoggedIn: true,
                                                                    loginMethod: 'email',
                                                                    pendingEmail: '',
                                                                    tokenRequested: false,
                                                                    verifiedEmail: pendingEmail,
                                                                });
                                                                return;
                                                            }

                                                            if (!emailValid) {
                                                                setLoginError('Invalid email.');
                                                                return;
                                                            }
                                                            if (emailValue !== emailConfirmValue) {
                                                                setLoginError('Email addresses do not match.');
                                                                return;
                                                            }

                                                            const existingEmailExpert = await checkIfEmailExists(emailValue);
                                                            const draftValues = getExpertDraftValues(existingEmailExpert);
                                                            setExpertExists(existingEmailExpert);

                                                            updateRegistrationSession({
                                                                draftValues,
                                                                expertProfile: existingEmailExpert,
                                                                loginMethod: 'email',
                                                                pendingEmail: emailValue,
                                                                tokenRequested: false,
                                                                verifiedEmail: '',
                                                            });

                                                            const tokenRequestSucceeded = await requestUserToken(emailValue);
                                                            if (!tokenRequestSucceeded) {
                                                                setLoginError('Unable to send verification token. Please try again later.');
                                                                return;
                                                            }

                                                            setLoginMethod('email');
                                                            setPendingEmail(emailValue);
                                                            setTokenRequested(true);
                                                            setLoginError('');
                                                            setLoginInfo('Verification token sent. Check your email and enter the token below.');

                                                            updateRegistrationSession({
                                                                loginMethod: 'email',
                                                                pendingEmail: emailValue,
                                                                tokenRequested: true,
                                                            });
                                                        }}
                                                    >
                                                        <div className="mb-3">
                                                            <label htmlFor="email" className="form-label">Email address</label>
                                                            <input
                                                                type="email"
                                                                className={`form-control${loginError ? ' is-invalid' : ''}`}
                                                                id="email"
                                                                name="email"
                                                                defaultValue={pendingEmail}
                                                                disabled={tokenRequested}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="emailConfirm" className="form-label">Confirm Email address</label>
                                                            <input
                                                                type="email"
                                                                className={`form-control${loginError ? ' is-invalid' : ''}`}
                                                                id="emailConfirm"
                                                                name="emailConfirm"
                                                                defaultValue={pendingEmail}
                                                                disabled={tokenRequested}
                                                                required
                                                            />
                                                        </div>

                                                        {tokenRequested && (
                                                            <div className="mb-3">
                                                                <label htmlFor="token" className="form-label">Verification token</label>
                                                                <input
                                                                    type="text"
                                                                    className={`form-control${loginError ? ' is-invalid' : ''}`}
                                                                    id="token"
                                                                    name="token"
                                                                    autoComplete="one-time-code"
                                                                    required
                                                                />
                                                            </div>
                                                        )}

                                                        <button type="submit" className="btn btn-primary mt-2">
                                                            {tokenRequested ? 'Verify token' : 'Register'}
                                                        </button>
                                                        {tokenRequested && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-link mt-2 ms-2"
                                                                onClick={handleResendToken}
                                                                disabled={isResendingToken}
                                                            >
                                                                {isResendingToken ? 'Resending...' : 'Resend token'}
                                                            </button>
                                                        )}
                                                        {tokenRequested && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-link mt-2 ms-2"
                                                                onClick={() => {
                                                                    setTokenRequested(false);
                                                                    setPendingEmail('');
                                                                    setExpertExists(null);
                                                                    setLoginError('');
                                                                    setLoginInfo('');
                                                                    setIsResendingToken(false);
                                                                }}
                                                            >
                                                                Use another email
                                                            </button>
                                                        )}
                                                        <button
                                                            type="button"
                                                            className="btn btn-link mt-2 ms-2"
                                                            onClick={handleGoBackToExpertSearch}
                                                        >
                                                            Go back to search expert
                                                        </button>
                                                        {loginInfo && <div className="text-success mt-2">{loginInfo}</div>}
                                                        {loginError && <div className="text-danger mt-2">{loginError}</div>}
                                                    </form>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                        )}
                        {(!isExpertForm || isLoggedIn) && (
                            <Row className="mt-3">
                                <Col>
                                    <Card className="w-100 px-4 py-3">
                                        <Row>
                                            <Col>
                                                <h1 className={color}>
                                                    {submissionHeading}
                                                </h1>
                                                <p className="mt-3 fs-4" style={{ whiteSpace: 'pre-line' }}>
                                                    {submissionDescription}
                                                </p>
                                            </Col>
                                        </Row>
                                        {!completed && requiresOrcidEmailVerification && (
                                            <OrcidEmailVerificationCard
                                                loginError={loginError}
                                                loginInfo={loginInfo}
                                                pendingEmail={pendingEmail}
                                                tokenRequested={tokenRequested}
                                                isResendingToken={isResendingToken}
                                                onSubmit={handleOrcidEmailVerificationSubmit}
                                                onResend={handleResendToken}
                                                onClearSession={handleClearOrcidSession}
                                                onResetEmailFlow={() => {
                                                    setTokenRequested(false);
                                                    setPendingEmail('');
                                                    setLoginError('');
                                                    setLoginInfo('');
                                                    setIsResendingToken(false);
                                                }}
                                            />
                                        )}
                                        {!completed && !requiresOrcidEmailVerification && (
                                            <Row>
                                                <Col>
                                                    <FormBuilder
                                                        formTemplate={formTemplate}
                                                        OrcidData={orcidUserData ?? {}}
                                                        TaxonomicExpert={expertExists}
                                                        Email={email}
                                                        LockedFieldValues={lockedFieldValues}
                                                        OnResetRegistration={isExpertForm ? handleGoBackToExpertSearch : undefined}
                                                        SetCompleted={handleSubmissionCompleted}
                                                    />
                                                </Col>
                                            </Row>
                                        )}
                                        {completed && isExpertForm && (
                                            <Row className="mt-3">
                                                <Col>
                                                    <button
                                                        type="button"
                                                        className="btn btn-link p-0"
                                                        onClick={handleGoBackToExpertSearch}
                                                    >
                                                        Go back to search expert
                                                    </button>
                                                </Col>
                                            </Row>
                                        )}
                                    </Card>
                                </Col>
                            </Row>
                        )}
                    </Col>
                </Row>
            </Container>

            <Footer />
        </div>
    );
};

export default TaxonomicForm;

type OrcidEmailVerificationCardProps = {
    loginError: string;
    loginInfo: string;
    pendingEmail: string;
    tokenRequested: boolean;
    isResendingToken: boolean;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
    onResend: () => Promise<void>;
    onClearSession: () => void;
    onResetEmailFlow: () => void;
};

const OrcidEmailVerificationCard = ({
    loginError,
    loginInfo,
    pendingEmail,
    tokenRequested,
    isResendingToken,
    onSubmit,
    onResend,
    onClearSession,
    onResetEmailFlow,
}: OrcidEmailVerificationCardProps) => {
    return (
        <Row>
            <Col>
                <Card className="w-100 px-4 py-3 mt-3">
                    <Row>
                        <Col>
                            <h2 className="fs-4">Add and verify your email</h2>
                            <p className="mt-2">
                                Your ORCID account does not provide an email. Please add an email, verify ownership with a login code, and then continue to the form.
                            </p>
                            <form onSubmit={onSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="orcidEmail" className="form-label">Email address</label>
                                    <input
                                        type="email"
                                        className={`form-control${loginError ? ' is-invalid' : ''}`}
                                        id="orcidEmail"
                                        name="orcidEmail"
                                        defaultValue={pendingEmail}
                                        disabled={tokenRequested}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="orcidEmailConfirm" className="form-label">Confirm Email address</label>
                                    <input
                                        type="email"
                                        className={`form-control${loginError ? ' is-invalid' : ''}`}
                                        id="orcidEmailConfirm"
                                        name="orcidEmailConfirm"
                                        defaultValue={pendingEmail}
                                        disabled={tokenRequested}
                                        required
                                    />
                                </div>

                                {tokenRequested && (
                                    <div className="mb-3">
                                        <label htmlFor="orcidEmailToken" className="form-label">Verification token</label>
                                        <input
                                            type="text"
                                            className={`form-control${loginError ? ' is-invalid' : ''}`}
                                            id="orcidEmailToken"
                                            name="orcidEmailToken"
                                            autoComplete="one-time-code"
                                            required
                                        />
                                    </div>
                                )}

                                <button type="submit" className="btn btn-primary mt-2">
                                    {tokenRequested ? 'Verify token' : 'Request verification code'}
                                </button>
                                {tokenRequested && (
                                    <button
                                        type="button"
                                        className="btn btn-link mt-2 ms-2"
                                        onClick={() => {
                                            void onResend();
                                        }}
                                        disabled={isResendingToken}
                                    >
                                        {isResendingToken ? 'Resending...' : 'Resend token'}
                                    </button>
                                )}
                                {tokenRequested && (
                                    <button
                                        type="button"
                                        className="btn btn-link mt-2 ms-2"
                                        onClick={onResetEmailFlow}
                                    >
                                        Use another email
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="btn btn-link mt-2 ms-2"
                                    onClick={onClearSession}
                                >
                                    Clear session
                                </button>
                                {loginInfo && <div className="text-success mt-2">{loginInfo}</div>}
                                {loginError && <div className="text-danger mt-2">{loginError}</div>}
                            </form>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    );
};
