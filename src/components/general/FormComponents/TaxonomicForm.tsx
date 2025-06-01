import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

/* Import Sources */
import TaxonomicExpertFormJSON from 'sources/forms/TaxonomicExpertForm.json';
import TaxonomicExpertFormOrcidJSON from 'sources/forms/TaxonomicExpertFormOrcid.json';
import TaxonomicServiceFormJSON from 'sources/forms/TaxonomicServiceForm.json';

/* Import Components */
import Header from 'components/general/header/Header';
import Footer from 'components/general/footer/Footer';
import { BreadCrumbs } from 'components/general/CustomComponents';
import FormBuilder from 'components/general/FormComponents/FormBuilder';
import { Color, getColor } from '../ColorPage';
import { useOrcidCallback } from 'api/orcid/auth';
import checkIfEmailExists from 'api/email/checkIfEmailExists';
import { TaxonomicExpert } from 'app/Types';

const TaxonomicForm = () => {
    const [completed, setCompleted] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [moreLogin, setMoreLogin] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [expertExists, setExpertExists] = useState<TaxonomicExpert | null>(null);
    const [loginError, setLoginError] = useState<string>('');

    const { userData, error } = useOrcidCallback();

    const isExpertForm = location.pathname.includes("/te");

    const title = isExpertForm
        ? 'Register as a new taxonomic expert'
        : 'Suggest a new taxonomic e-service';

    const description = isExpertForm
        ? 'Use this form to register as a new expert that should be listed in the CETAF Marketplace.\nPlease fill in the required fields and add as much additional information as you can.\nThe CETAF secretariat will review and curate your submission before adding it to the marketplace\nTo be accepted it needs to be a taxonomic tool or service and it needs to be of sufficient quality.\nPlease propose only services that are in production and maintained.'
        : 'Use this form to suggest new taxonomic e-services or tools that should be listed in the CETAF Marketplace.\nPlease fill in the required fields and add as much additional information as you can.\nThe CETAF secretariat will review and curate your submission before adding it to the marketplace.\nTo be accepted it needs to be a taxonomic tool or service and it needs to be of sufficient quality\nPlease propose only services that are in production and maintained.';

    const sended = isExpertForm
        ? 'Your submission is received and will be processed by the Marketplace! A CETAF administrator will review the request. The review can take up to 5 working days. Your profile will be published on the Marketplace once the review is completed.\nThank you for using the Taxonomic Marketplace!'
        : 'Your submission is received and will be processed by the Marketplace! A CETAF administrator will review and score the taxonomic service. When the score is sufficient, the service will be published in the Marketplace catalog.\nThank you for using the Taxonomic Marketplace!';

    let formTemplate = isExpertForm ? TaxonomicExpertFormJSON : TaxonomicServiceFormJSON;
    const color = "fs-2 tc-" + getColor(window.location) as Color;

    useEffect(() => {
        if (userData) {
            formTemplate = TaxonomicExpertFormOrcidJSON;
            setIsLoggedIn(true);
        }
    }, [userData]);

    const redirectToOrcidAuth = () => {
        const orcidAuthUrl = `https://orcid.org/oauth/authorize?client_id=${import.meta.env.VITE_ORCID_CLIENT_ID}&response_type=code&scope=/authenticate&redirect_uri=${import.meta.env.VITE_ORCID_REDIRECT_URI}`;
        window.location.href = orcidAuthUrl;
    };

    return (
        <div className="h-100 d-flex flex-column">
            <Header />

            <Container fluid className="flex-grow-1 overflow-hidden">
                <Row className="h-100">
                    <Col xs={{ span: 10, offset: 1 }} lg={{ span: 6, offset: 3 }} className="h-100 pt-4 pt-lg-5 pb-4 overflow-scroll">
                        <Row>
                            <Col>
                                <BreadCrumbs />
                            </Col>
                        </Row>
                        {isExpertForm && !isLoggedIn && (
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
                                                    >
                                                        Login with ORCID
                                                    </button>
                                                    <button
                                                        className="btn btn-link p-0 ms-2"
                                                        style={{ fontSize: '0.95rem' }}
                                                        onClick={() => setMoreLogin(m => !m)}
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
                        {
                        moreLogin && isExpertForm && !isLoggedIn && 
                        (
                            <Row className="mt-3">
                                <Col>
                                    <Card className="w-100 px-4 py-3">
                                        <Row>
                                            <Col>
                                                <div>
                                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                                        <h2 className="fs-4 mb-0">{'Register with an Email'}</h2>
                                                        <button
                                                            className="btn btn-link p-0"
                                                            style={{ fontSize: '1rem' }}
                                                            onClick={() => {
                                                                setLoginError('');
                                                            }}
                                                            type="button"
                                                        >
                                                        </button>
                                                    </div>
                                                    <form
                                                        onSubmit={async e => {
                                                            e.preventDefault();

                                                            const form = e.currentTarget as HTMLFormElement;
                                                            const email = form.elements.namedItem('email') as HTMLInputElement;
                                                            const emailValue = email.value.trim();
                                                            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
                                                            if (!emailValid) {
                                                                setLoginError('Invalid email or password.');
                                                                return;
                                                            }
                                                            const exist = await checkIfEmailExists(emailValue);
                                                            if (exist) {
                                                                setExpertExists(exist as TaxonomicExpert);
                                                            }
                                                            if (exist) {
                                                                setLoginError('Email already registered. Please send a ticket to the Marketplace helpdesk to update your profile.');
                                                                return;
                                                            }
                                                            setEmail(emailValue);
                                                            setIsLoggedIn(true);
                                                            setLoginError('');
                                                        }}

                                                    >
                                                        <div className="mb-3">
                                                            <label htmlFor="email" className="form-label">Email address</label>
                                                            <input type="email" className={`form-control${loginError ? ' is-invalid' : ''}`} id="email" name="email" required />
                                                        </div>
                                                        <button type="submit" className="btn btn-primary mt-2">
                                                            {'Register'}
                                                        </button>
                                                        {loginError && <div className="text-danger mt-2">{loginError}</div>}
                                                    </form>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                        )}
                        {
                        (!isExpertForm || isLoggedIn) &&
                         (
                            <Row className="mt-3">
                                <Col>
                                    <Card className="w-100 px-4 py-3">
                                        <Row>
                                            <Col>
                                                <h1 className={color}>
                                                    {!completed ? title : 'Submission received'}
                                                </h1>
                                                <p className="mt-3 fs-4" style={{ whiteSpace: 'pre-line' }}>
                                                    {!completed ? description : sended}
                                                </p>
                                            </Col>
                                        </Row>
                                        {!completed && (
                                            <Row>
                                                <Col>
                                                    <FormBuilder formTemplate={formTemplate} OrcidData={userData ?? {}} TaxonomicExpert={expertExists} Email={email} SetCompleted={() => setCompleted(true)} />
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
