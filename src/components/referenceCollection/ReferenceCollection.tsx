/* Import Dependencies */
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/* Import Components */
import Header from 'components/general/header/Header';
import Footer from 'components/general/footer/Footer';

/* Import Data */
import { pollinatorCollections } from 'components/pollinatorCollections/pollinatorCollectionsData';


/**
 * Component that renders the Reference Collection landing page
 * @returns JSX Component
 */
const ReferenceCollection = () => {
    return (
        <div className="h-100 d-flex flex-column">
            <Header />

            <Container fluid className="flex-grow-1 overflow-auto">
                <Row className="h-100">
                    <Col lg={{ span: 10, offset: 1 }}
                        className="h-100 d-flex flex-column pt-3 pt-lg-5 px-4 px-lg-3"
                    >
                        <Row>
                            <Col>
                                <h1 className="fs-2 fw-bold">Reference Collections</h1>
                                <p className="fs-4 mt-2">Explore curated collection resources and related datasets.</p>
                            </Col>
                        </Row>

                        <Row className="mt-4 mb-4">
                            <Col xs={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
                                <Link to="/pollinator-collections" className="d-block">
                                    <div className="h-100 p-4 bgc-white border rounded shadow-sm">
                                        <p className="fs-3 fw-bold tc-secondary">Pollinator Collection</p>
                                        <p className="fs-4 mt-2">Linked pollinator collection descriptors and EuSurvey model files.</p>
                                        <p className="fs-2 fw-bold tc-secondary mt-3">{pollinatorCollections.length}</p>
                                        <p className="fs-4">collections in data</p>
                                    </div>
                                </Link>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>

            <Footer />
        </div>
    );
}

export default ReferenceCollection;
