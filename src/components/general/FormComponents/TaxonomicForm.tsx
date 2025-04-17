import { useState, useEffect } from 'react';
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

/**
 * Component that renders the taxonomic service form
 * @returns JSX Component
 */
const TaxonomicForm = () => {
    /* Base variables */
    const [completed, setCompleted] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const title = location.pathname.includes("/te") ? 'Register as a new taxonomic expert' : 'Suggest a new taxonomic e-service';
    const description = location.pathname.includes("/te") ? 'Use this form to register as a new expert that should be listed in the CETAF Marketplace.\nPlease fill in the required fields and add as much additional information as you can.\nThe CETAF secretariat will review and curate your submission before adding it to the marketplace\nTo be accepted it needs to be a taxonomic tool or service and it needs to be of sufficient quality.\nPlease propose only services that are in production and maintained.' : 'Use this form to suggest new taxonomic e-services or tools that should be listed in the CETAF Marketplace.\nPlease fill in the required fields and add as much additional information as you can.\nThe CETAF secretariat will review and curate your submission before adding it to the marketplace.\nTo be accepted it needs to be a taxonomic tool or service and it needs to be of sufficient quality\nPlease propose only services that are in production and maintained.';
    const sended = location.pathname.includes("/te") ? 'Your submission is received and will be processed by the Marketplace! A CETAF administrator will review the request. The review can take up to 5 working days. Your profile will be published on the Marketplace once the review is completed.\nThank you for using the Taxonomic Marketplace!' : 'Your submission is received and will be processed by the Marketplace! A CETAF administrator will review and score the taxonomic service. When the score is sufficient, the service will be published in the Marketplace catalog.\nThank you for using the Taxonomic Marketplace!';
    
    const formTemplate = location.pathname.includes("/te") ? TaxonomicExpertFormJSON : TaxonomicServiceFormJSON;

    /* Determine color */
    const color = "fs-2 tc-" + getColor(window.location) as Color;

    // Use the ORCID callback hook
    const { userData } = useOrcidCallback();
    
    // Handle ORCID login success
    useEffect(() => {
        if (userData) {
            setIsLoggedIn(true);
        }
    }, [userData]);

    // Function to redirect to ORCID login
    const redirectToOrcidAuth = () => {
        const authorizationUrl = `https://orcid.org/oauth/authorize?client_id=${import.meta.env.VITE_ORCID_CLIENT_ID}&response_type=code&scope=/authenticate&redirect_uri=${import.meta.env.VITE_ORCID_REDIRECT_URI}`;
        window.location.href = authorizationUrl;
    };

    return (
        <div className="h-100 d-flex flex-column">
            {/* Render Header */}
            <Header />

            {/* Home page Body */}
            <Container fluid className="flex-grow-1 overflow-hidden">
                <Row className="h-100">
                    <Col xs={{ span: 10, offset: 1 }}
                        lg={{ span: 6, offset: 3 }}
                        className="h-100 pt-4 pt-lg-5 pb-4 overflow-scroll"
                    >
                        <Row>
                            <Col>
                                <BreadCrumbs />
                            </Col>
                        </Row>
                        {location.pathname.includes("/te") && !isLoggedIn && (
                            <Row>
                                <Col>
                                    <Card className="w-100 px-4 py-3">
                                        <Row>
                                            <Col>
                                                <h2 className="fs-4">Login with ORCID</h2>
                                                <p className="mt-2">
                                                    To proceed, please log in using your ORCID account. This ensures that your submission is linked to your professional profile.
                                                </p>
                                                <button
                                                    className="btn btn-primary mt-3"
                                                    onClick={redirectToOrcidAuth}
                                                >
                                                    Login with ORCID
                                                </button>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                        )}
                        <Row className="mt-3">
                            <Col>
                                <Card className="w-100 px-4 py-3">
                                    {/* Form title and description */}
                                    <Row>
                                        <Col>
                                            <h1 className={color}>
                                                {!completed ?
                                                    title
                                                    : 'Submission received'
                                                }
                                            </h1>
                                            {!completed ?
                                                <p className="mt-3 fs-4">
                                                    {description}
                                                </p>
                                                : <p className="mt-3 fs-4">
                                                    {sended}
                                                </p>
                                            }
                                        </Col>
                                    </Row>
                                    {/* Form content */}
                                    {!completed &&
                                        <Row>
                                            <Col>
                                                <FormBuilder formTemplate={formTemplate}
                                                    SetCompleted={() => setCompleted(true)}
                                                />
                                            </Col>
                                        </Row>
                                    }
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>

            {/* Render Footer */}
            < Footer />
        </div>
    );
};

export default TaxonomicForm;
