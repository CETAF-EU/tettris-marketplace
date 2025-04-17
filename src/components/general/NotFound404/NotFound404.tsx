/* Import Dependencies */
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/* Import Components */
import Header from '../header/Header';
import Footer from '../footer/Footer';


const NotFound404 = () => {
    return (
        <div className="h-100 d-flex flex-column">
            {/* Render header */}
            <Header />

            {/* Render not found 404 page */}
            <Container fluid className="flex-grow-1">
                <Row className="h-100">
                    <Col className="d-flex flex-column justify-content-center align-items-center">
                        <p className="fs-2 fw-lightBold">404 - Page not found</p>
                        <p className="mt-3">Looks like the taxonomic tree ends here...</p>
                        <p>
                            Please try again or
                            <Link to="/"
                                className="tc-primary"
                            >
                                {` go back to home`}
                            </Link>
                        </p>
                    </Col>
                </Row>
            </Container>

            {/* Render footer */}
            <Footer />
        </div> 
    );
};

export default NotFound404;