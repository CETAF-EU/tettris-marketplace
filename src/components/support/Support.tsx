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
            <Container fluid className="flex-grow-1 overflow-hidden">
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
                            <Row className="flex-grow-1">
                                <Col className="d-flex flex-column justify-content-center align-items-center">
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
                            </Row>
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
