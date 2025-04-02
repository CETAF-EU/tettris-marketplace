/* Import Dependencies */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row, } from 'react-bootstrap';

// /* Import Hooks */
import { useFetch } from 'app/Hooks';




/* Import Components */
import Header from 'components/general/header/Header';
import Footer from 'components/general/footer/Footer';
import { Spinner } from 'components/general/CustomComponents';

const Support = () => {
    /* Hooks */
    const fetch = useFetch();

    // /* Base variables */
    const [errorMessage] = useState<string | undefined>();
    const [displaySpinner, setDisplaySpinner] = useState<boolean>(false);


    // /* Time out to check if the taxonomic service is still being loaded after 1.5 seconds */
    setTimeout(() => {
        if (fetch.loading) {
            setDisplaySpinner(true);
        };
    }, 1500);

    return (
        <div className="h-100 d-flex flex-column">
            {/* Render Header */}
            <Header />

            {/* Home page Body */}
            <Container fluid className="flex-grow-1 overflow-hidden">
                <Row className="h-100">
                    <Col lg={{ span: 10, offset: 1 }}
                        className="h-100 d-flex flex-column pt-3 pt-lg-5 px-4 px-lg-3"
                    >
                        {/* If data is still being loaded after 1.5 seconds, display spinner */}
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
                        {/* body */}
                        {!fetch.loading && !errorMessage &&
                            <Row className="flex-grow-1">
                                <Col className="d-flex flex-column justify-content-center align-items-center">
                                    <Row>
                                        <Col>
                                            <h2 className="fs-2 fw-lightBold">Support</h2>
                                        </Col>
                                    </Row>
                                    <Row className="mt-2">
                                        <Col>
                                            <p>{`You can contact us at info@cetaf.org for any questions or issues you may have.`}</p>
                                        </Col>
                                    </Row>
                                    <Row className="mt-2">
                                        <Col>
                                            <p>Thank you for using the Taxonomic Marketplace!</p>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row >
                        }
                        {/* If an error occurred */}
                        {errorMessage &&
                            <Row className="h-100">
                                <Col className="d-flex flex-column justify-content-center align-items-center">
                                    <Row>
                                        <Col>
                                            <p>{`An error occurred whilst searching for the support page`}</p>
                                        </Col>
                                    </Row>
                                    <Row className="mt-2">
                                        <Col>
                                            <p>{errorMessage}</p>
                                        </Col>
                                    </Row>
                                    <Row className="mt-2">
                                        <Col>
                                            <p>
                                                Retry or go back to <Link to="/"
                                                    className="tc-tertiary"
                                                >
                                                    home
                                                </Link></p>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        }
                    </Col>
                </Row>
            </Container >
            {/* Render Footer */}
            < Footer />
        </div >
    );
}

export default Support;