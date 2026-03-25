/* Import Dependencies */
import { useState } from 'react';
import axios from 'axios';
import { Row, Col, Modal } from 'react-bootstrap';

/* Import Types */
import { TaxonomicExpert } from 'app/Types';

/* Import Components */
import { Button } from 'components/general/CustomComponents';
import requestUserToken from 'api/email/UserToken';
import verifyUserToken from 'api/email/VerifyUserToken';
import { clearStoredAuthToken, getStoredAuthToken } from 'api/auth/session';
import ContactTaxonomicExpert from 'api/taxonomicExpert/ContactTaxonomicExpert';

const getIconClass = (link: string) => {
    const iconMap: { [key: string]: string } = {
        'github.com': "bi bi-github p-1",
        'linkedin.com': "bi bi-linkedin p-1",
        'twitter.com': "bi bi-twitter p-1",
        'facebook.com': "bi bi-facebook p-1",
        'instagram.com': "bi bi-instagram p-1",
        'youtube.com': "bi bi-youtube p-1",
        'tiktok.com': "bi bi-tiktok p-1",
        'pinterest.com': "bi bi-pinterest p-1",
        'reddit.com': "bi bi-reddit p-1",
        'medium.com': "bi bi-medium p-1",
        'snapchat.com': "bi bi-snapchat p-1",
        'tumblr.com': "bi bi-tumblr p-1",
        'whatsapp.com': "bi bi-whatsapp p-1",
        'telegram.org': "bi bi-telegram p-1",
        'discord.com': "bi bi-discord p-1",
        'slack.com': "bi bi-slack p-1",
        'dribbble.com': "bi bi-dribbble p-1",
        'behance.net': "bi bi-behance p-1",
        'flickr.com': "bi bi-flickr p-1",
        'quora.com': "bi bi-quora p-1",
    };

    for (const domain in iconMap) {
        if (link.includes(domain)) {
            return iconMap[domain];
        }
    }
    return "bi bi-globe p-1";
};

/* Props Type */
type Props = {
    taxonomicExpert: TaxonomicExpert
    expertHandle: string
};

/**
 * Component that renders the Top Bar of the Taxonomic Expert page
 * @param taxonomicExpert The chosen Taxonomic Service
 * @returns JSX Component
 */
const TopBar = (props: Props) => {
    const { taxonomicExpert, expertHandle } = props;
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [pendingEmail, setPendingEmail] = useState('');
    const [tokenRequested, setTokenRequested] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResendingToken, setIsResendingToken] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [loginInfo, setLoginInfo] = useState('');
    const [contactSubject, setContactSubject] = useState('');
    const [contactMessage, setContactMessage] = useState('');
    const [contactError, setContactError] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    
    const name = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:name'] as string || 'Any name provided';
    const orcidID = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:orcid'] as string || null;
    const headline = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:headline'] as string || 'Any headline provided';
    const location = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:location'] as string || 'Any location provided';
    const language = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:language']?.join(' / ').toUpperCase() ?? 'Any languages provided';
    const image = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:ProfilePicture'] as string || 'https://i.pinimg.com/236x/d9/d8/8e/d9d88e3d1f74e2b8ced3df051cecb81d.jpg';
    const affiliationName = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:affiliation']?.['schema:name'] as string || 'Any affiliation name provided';
    const affiliationURL = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:affiliation']?.['schema:identifier'] as string || null;
    const affiliationURLText = affiliationURL ? taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:affiliation']?.['schema:url'] as string : null;
    const personalLinks = Array.isArray(taxonomicExpert?.taxonomicExpert?.['schema:person']?.["schema:links"])
        ? taxonomicExpert.taxonomicExpert['schema:person']["schema:links"].flat()
        : null;
    const datePublished = taxonomicExpert?.taxonomicExpert?.['schema:datePublished'] as string || null;

    const resetLoginState = () => {
        setPendingEmail('');
        setTokenRequested(false);
        setIsSubmitting(false);
        setIsResendingToken(false);
        setLoginError('');
        setLoginInfo('');
    };

    const resetContactState = () => {
        setContactSubject('');
        setContactMessage('');
        setContactError('');
        setContactInfo('');
    };

    const handleCloseModal = () => {
        resetLoginState();
        resetContactState();
        setShowLoginModal(false);
    };

    const isLoggedIn = Boolean(getStoredAuthToken());

    const handleEmailRequest = () => {
        setLoginError('');
        setLoginInfo('');
        setContactError('');
        setContactInfo('');
        setShowLoginModal(true);
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

    const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget;
        const emailInput = form.elements.namedItem('email') as HTMLInputElement;
        const emailConfirmInput = form.elements.namedItem('emailConfirm') as HTMLInputElement;
        const tokenInput = form.elements.namedItem('token') as HTMLInputElement | null;
        const emailValue = emailInput.value.trim();
        const emailConfirmValue = emailConfirmInput.value.trim();
        const tokenValue = tokenInput?.value.trim() || '';
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

        setIsSubmitting(true);
        setLoginError('');

        try {
            if (tokenRequested) {
                if (!tokenValue) {
                    setLoginError('Please enter the verification token.');
                    return;
                }

                const isTokenValid = await verifyUserToken(pendingEmail, tokenValue);
                if (!isTokenValid) {
                    setLoginError('Invalid or expired token. Please try again.');
                    return;
                }

                setTokenRequested(false);
                setPendingEmail('');
                return;
            }

            if (!isEmailValid) {
                setLoginError('Invalid email.');
                return;
            }

            if (emailValue !== emailConfirmValue) {
                setLoginError('Email addresses do not match.');
                return;
            }

            const tokenRequestSucceeded = await requestUserToken(emailValue);
            if (!tokenRequestSucceeded) {
                setLoginError('Unable to send verification token. Please try again later.');
                return;
            }

            setPendingEmail(emailValue);
            setTokenRequested(true);
            setLoginInfo('Verification token sent. Check your email and enter the token below.');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setLoginError(error.response?.data?.detail ?? 'Unable to log in with this email right now.');
                return;
            }

            setLoginError('Unable to complete the login right now. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleContactSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedSubject = contactSubject.trim();
        const trimmedMessage = contactMessage.trim();

        if (!trimmedSubject) {
            setContactError('Please enter a subject.');
            return;
        }

        if (!trimmedMessage) {
            setContactError('Please enter a message.');
            return;
        }

        setIsSubmitting(true);
        setContactError('');
        setContactInfo('');

        try {
            await ContactTaxonomicExpert({
                expertId: expertHandle,
                subject: trimmedSubject,
                message: trimmedMessage,
            });

            setContactInfo('Message sent.');
            setContactSubject('');
            setContactMessage('');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if ([401, 403].includes(error.response?.status ?? 0)) {
                    clearStoredAuthToken();
                    resetLoginState();
                    setLoginError(error.response?.data?.detail ?? 'Login is required to send a contact request.');
                    return;
                }

                setContactError(error.response?.data?.detail ?? 'Failed to send email.');
                return;
            }

            setContactError('Failed to send email.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (<>
        <Col lg='auto' className="mb-3">
            <Row className="text-center">
                <h1 className="fs-2">{name}</h1>
            </Row>
            <Row className='justify-content-center'>
                <img className="h-100 w-100 object-fit-contain" src={image} alt={name} style={{ maxWidth: '10rem', aspectRatio: '1 / 1'}} />
            </Row>
        </Col>
        <Col lg="6" className='mt-1'>
            <Row className="justify-content-center text-center text-md-start">
                <Col xs={12} md="auto"> 
                    {orcidID ? (
                    <a href={"https://orcid.org/" + orcidID} target="_blank" rel="noopener noreferrer">
                        <p className="fw-lightBold bi bi-link-45deg"> ORCID number</p>
                    </a>
                    ) : (
                    <p className="fw-lightBold bi bi-link-45deg"> Any orcid ID provided</p>
                    )}
                </Col>
                <Col xs={12} md="auto">
                    <p className="fw-lightBold bi bi-geo-alt-fill"> {location}</p>
                </Col>
                <Col xs={12} md="auto">
                    <p className="fw-lightBold bi bi-globe2"> {language}</p>
                </Col>
            </Row>
            <Row className="justify-content-center text-center custom-justify">
                <Col xs={12}>
                    <Row className="mt-5 d-none d-md-flex custom-top" />

                    <Row className="mt-1 mb-3 justify-content-center custom-justify">
                        <Col xs="auto">
                            <p className="fs-3 fw-bold text-center">{headline}</p>
                        </Col>
                    </Row>
                    <Row className="justify-content-center text-center custom-justify">
                        <Col xs={12} md="auto">
                            <p className="fw-lightBold mb-1">{affiliationName}</p>
                        </Col>
                        <Col xs={12} md="auto">
                            {affiliationURLText ? (
                            <a href={affiliationURLText} target="_blank" rel="noopener noreferrer">
                                <i className="fw-lightBold bi bi-link-45deg"></i> URL
                            </a>
                            ) : (
                            <i className="fw-lightBold bi bi-link-45deg">No URL provided</i>
                            )}
                        </Col>
                        <Col xs={12} md="auto">
                            {affiliationURL ? (
                            <a href={affiliationURL} target="_blank" rel="noopener noreferrer">
                                <i className="fw-lightBold bi bi-link-45deg"> ROR ID</i>
                            </a>
                            ) : (
                            <i className="fw-lightBold bi bi-link-45deg">No ROR ID provided</i>
                            )}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Col>
        <Col lg="2" className="d-none d-lg-block"></Col>
        <Col lg="2" className="mt-1">
            <Row className="justify-content-center text-center">
                <Col xs="auto">
                    <Button type="button" variant='tertiary' OnClick={handleEmailRequest}>
                        <span><i className="bi bi-envelope-fill"></i> EMAIL</span>
                    </Button>
                </Col>
            </Row>
            <Row className="justify-content-center text-center mt-3 mb-3">
                <Col xs="auto" className="d-flex justify-content-center gap-2">
                    {Array.isArray(personalLinks) && personalLinks.some(link => link !== null) ? (
                        personalLinks.map((link, index) => (
                            link ? (
                                <a key={`${link}-${index}`} href={link} target="_blank" rel="noopener noreferrer">
                                    <i className={getIconClass(link)}></i>
                                </a>
                            ) : null
                        ))
                    ) : null}
                </Col>
            </Row>
            <Row className="mt-5 d-none d-md-flex custom-top" />
            <Row className="justify-content-center text-center mb-3">
                <Col xs="auto" className='text-center'>
                    {datePublished ? (
                        <p className="fw-lightBold">Last update on {new Date(datePublished).toLocaleDateString()}</p>
                    ) : (
                        <p className="fw-lightBold">No update date provided</p>)}
                </Col>
            </Row>
        </Col>
        <Modal show={showLoginModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
                <Modal.Title className="tc-tertiary">Contact Expert</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {!isLoggedIn ? (
                    <>
                        <p className="mb-3">
                            Log in with your email to send a contact request to this expert.
                        </p>
                        <form onSubmit={handleLoginSubmit}>
                            <div className="mb-3">
                                <label htmlFor="expert-email-login" className="form-label">Email address</label>
                                <input
                                    type="email"
                                    className={`form-control${loginError ? ' is-invalid' : ''}`}
                                    id="expert-email-login"
                                    name="email"
                                    disabled={tokenRequested || isSubmitting}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="expert-email-confirm" className="form-label">Confirm email address</label>
                                <input
                                    type="email"
                                    className={`form-control${loginError ? ' is-invalid' : ''}`}
                                    id="expert-email-confirm"
                                    name="emailConfirm"
                                    disabled={tokenRequested || isSubmitting}
                                    required
                                />
                            </div>
                            {tokenRequested && (
                                <div className="mb-3">
                                    <label htmlFor="expert-email-token" className="form-label">Verification token</label>
                                    <input
                                        type="text"
                                        className={`form-control${loginError ? ' is-invalid' : ''}`}
                                        id="expert-email-token"
                                        name="token"
                                        autoComplete="one-time-code"
                                        disabled={isSubmitting}
                                        required
                                    />
                                </div>
                            )}
                            {loginInfo && <div className="text-success mt-2">{loginInfo}</div>}
                            {loginError && <div className="text-danger mt-2">{loginError}</div>}
                            <div className="d-flex flex-wrap gap-2 mt-3">
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Please wait...' : tokenRequested ? 'Verify token' : 'Request token'}
                                </button>
                                {tokenRequested && (
                                    <button
                                        type="button"
                                        className="btn btn-link"
                                        onClick={handleResendToken}
                                        disabled={isResendingToken || isSubmitting}
                                    >
                                        {isResendingToken ? 'Resending...' : 'Resend token'}
                                    </button>
                                )}
                                {tokenRequested && (
                                    <button
                                        type="button"
                                        className="btn btn-link"
                                        disabled={isSubmitting}
                                        onClick={() => {
                                            clearStoredAuthToken();
                                            resetLoginState();
                                        }}
                                    >
                                        Use another email
                                    </button>
                                )}
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <p className="mb-3">
                            Send a message through the Marketplace. The expert will receive your email address and can reply directly.
                        </p>
                        <div className="mb-3">
                            {contactInfo ? (
                                <div className="text-success mt-2">{contactInfo}</div>
                            ) : (
                                <form onSubmit={handleContactSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="expert-contact-subject" className="form-label">Subject</label>
                                        <input
                                            type="text"
                                            className={`form-control${contactError ? ' is-invalid' : ''}`}
                                            id="expert-contact-subject"
                                            value={contactSubject}
                                            onChange={event => setContactSubject(event.target.value)}
                                            disabled={isSubmitting}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="expert-contact-message" className="form-label">Message</label>
                                        <textarea
                                            className={`form-control${contactError ? ' is-invalid' : ''}`}
                                            id="expert-contact-message"
                                            value={contactMessage}
                                            onChange={event => setContactMessage(event.target.value)}
                                            rows={6}
                                            disabled={isSubmitting}
                                            required
                                        />
                                    </div>
                                    {contactError && <div className="text-danger mt-2">{contactError}</div>}
                                    <div className="d-flex flex-wrap gap-2 mt-3">
                                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                            {isSubmitting ? 'Sending...' : 'Send message'}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-link"
                                            disabled={isSubmitting}
                                            onClick={() => {
                                                clearStoredAuthToken();
                                                resetLoginState();
                                                resetContactState();
                                            }}
                                        >
                                            Log out
                                        </button>
                                    </div>
                                </form>
                            )}
                            {contactInfo && (
                                <div className="d-flex flex-wrap gap-2 mt-3">
                                    <button
                                        type="button"
                                        className="btn btn-link"
                                        onClick={() => {
                                            clearStoredAuthToken();
                                            resetLoginState();
                                            resetContactState();
                                        }}
                                    >
                                        Log out
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </Modal.Body>
        </Modal>
    </>);
}

export default TopBar;
