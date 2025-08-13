import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';

import { useFetch } from 'app/Hooks';
import Header from 'components/general/header/Header';
import Footer from 'components/general/footer/Footer';
import { Spinner } from 'components/general/CustomComponents';

const Support = () => {
    const fetch = useFetch();
    const [errorMessage] = useState<string | undefined>();
    const [displaySpinner, setDisplaySpinner] = useState<boolean>(false);
    
    // Spinner timeout
    useEffect(() => {
        const timer = setTimeout(() => {
            if (fetch.loading) setDisplaySpinner(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, [fetch.loading]);

    // Inject the widget config and script
    // useEffect(() => {
    //     // Inject config as global variable
    //     const scriptContent = document.createElement('script');
    //     scriptContent.innerHTML = `
    //         var hdWidget = {
    //             position: "right",
    //             bgColor: "#4c5b6b",
    //             fgColor: "#ffffff",
    //             borderColor: "#fff",
    //             categoryId: 42,
    //             hideCategory: 0,
    //             autoShow: 0,
    //             email: "",
    //             showKbArticles: 1
    //         };
    //     `;
    //     document.body.appendChild(scriptContent);

    //     // Inject external script
    //     const script = document.createElement('script');
    //     script.src = "https://dissco.jitbit.com/helpdesk/js/support-widget-light.js";
    //     script.defer = true;
    //     document.body.appendChild(script);

    //     // Cleanup
    //     return () => {
    //         document.body.removeChild(scriptContent);
    //         document.body.removeChild(script);
    //     };
    // }, []);

    return (
        <div className="h-100 d-flex flex-column">
            <Header />
            <Container fluid className="flex-grow-1 overflow-auto">
                <Row className="h-100">
                    <Col lg={{ span: 10, offset: 1 }} className="h-100 d-flex flex-column pt-3 pt-lg-5 px-4 px-lg-3">
                        {(fetch.loading && displaySpinner) &&
                            <Row className="flex-grow-1">
                                <Col className="d-flex justify-content-center align-items-center">
                                    <div className="text-center">
                                        <p className="fs-2 fw-lightBold pb-2">Loading the support page</p>
                                        <Spinner />
                                    </div>
                                </Col>
                            </Row>
                        }
                        {!fetch.loading && !errorMessage &&
                            <Col>
                                <Row className="mt-5 mb-4">
                                    <Col lg={{ span: 10, offset: 1 }} className="p-4 bg-light rounded shadow-sm">
                                        <h3 className="fw-bold mb-4">About the Taxonomic Marketplace</h3>
                                        <p>
                                            The Taxonomic Marketplace is part of the TETTRIs Work Package 3 initiative, aiming to create a unified platform for accessing both 
                                            taxonomic services and expertise. It is designed to connect users—such as researchers, institutions, and citizen scientists—with 
                                            taxonomists and analytical tools to support specimen identification, classification, and broader scientific collaboration.
                                        </p>
                                        <p>
                                            The marketplace will act as a catalogue, similar in spirit to the EOSC Marketplace, but specifically tailored for taxonomy. 
                                            It will combine data-driven interfaces, annotation tools, and expert directories into one accessible entry point. The system 
                                            will reuse and build upon existing infrastructures like the DiSSCo API and integrate additional services such as Machine Annotation Services (MAS).
                                        </p>

                                        <h4 className="fw-bold mt-4 mb-3">Development Approach</h4>
                                        <p>
                                            The services component of the marketplace will be launched first, followed by integration of the expertise module—potentially as 
                                            a unified frontend with distinct backend systems. Discussions with stakeholders (e.g. DiSSCo, WP3 task leads, community workshops) 
                                            are shaping both the data model and technical stack. Community-approved tools will be prioritized, with validation rules in place 
                                            to avoid displaying outdated or unmaintained services.
                                        </p>

                                        <h4 className="fw-bold mt-4 mb-3">How to Use the Marketplace</h4>
                                        <div className="d-flex flex-column gap-3">
                                            <div>
                                                <h5 className="fw-semibold">For Requesters:</h5>
                                                <ol className="ps-3">
                                                    <li>Browse available services and registered experts</li>
                                                    <li>Submit a request for identification or consultation</li>
                                                    <li>Provide relevant data, images, and deadlines</li>
                                                    <li>Review proposals and select an expert or tool</li>
                                                    <li>Receive your results or feedback directly via the platform</li>
                                                </ol>
                                            </div>
                                            <div>
                                                <h5 className="fw-semibold">For Taxonomists and Service Providers:</h5>
                                                <ol className="ps-3">
                                                    <li>Register and describe your expertise or tool</li>
                                                    <li>Respond to open requests or publish your service in the catalogue</li>
                                                    <li>Ensure your profile or tool meets community quality requirements</li>
                                                    <li>Maintain your listing to remain visible and searchable</li>
                                                    <li>Collaborate with users through the platform’s interface</li>
                                                </ol>
                                            </div>
                                        </div>

                                        <p className="mt-4">
                                            The marketplace will evolve over time, based on community feedback and technical input.
                                        </p>
                                        <Col className="d-flex flex-column align-items-center mt-5">
                                            <Row><Col><h2 className="fs-2 fw-lightBold">Support</h2></Col></Row>
                                            <Row className="mt-2"><Col><p>You can contact us at support@dissco.jitbit.com for any questions or issues you may have.</p></Col></Row>
                                            <Row className="mt-2">
                                                <Col>
                                                    <p>
                                                        Need further assistance? <a href="mailto:support@dissco.jitbit.com" className="tc-tertiary">Create a support ticket</a>.
                                                    </p>
                                                </Col>
                                            </Row>
                                            <Row className="mt-2"><Col><p>Thank you for using the Taxonomic Marketplace!</p></Col></Row>
                                        </Col>
                                    </Col>
                                    
                                </Row>
                            </Col>
                        }
                        {errorMessage &&
                            <Row className="h-100">
                                <Col className="d-flex flex-column justify-content-center align-items-center">
                                    <Row><Col><p>An error occurred whilst searching for the support page</p></Col></Row>
                                    <Row className="mt-2"><Col><p>{errorMessage}</p></Col></Row>
                                    <Row className="mt-2">
                                        <Col>
                                            <p>Retry or go back to <Link to="/" className="tc-tertiary">home</Link></p>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        }
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
};

export default Support;
