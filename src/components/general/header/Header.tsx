/* Import Dependencies */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

/* Import Hooks */
import { useAppSelector } from 'app/Hooks';

/* Import Store */
import { getApiStatus } from 'redux-store/AppStore';

/* Import Webroot */
import CETAFLogo from 'webroot/img/cetafLogo.png';

/* Import Styles */
import styles from './header.module.scss';

/* Import Icons */
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';


/**
 * Component that renders the application's Header
 * @returns JSX Component
 */
const Header = () => {
    /* Base variables */
    const apiStatus = useAppSelector(getApiStatus);

    return (
        <Container fluid
            className={styles.header}
        >
            <Row className="bgc-white py-2 px-2">
                <Col lg={{ span: 10, offset: 1 }}>
                    <Row className="align-items-center">
                        <Col className="col-auto">
                            <Link to="/">
                                <img src={CETAFLogo}
                                    alt="CETAF Logo"
                                    className={styles.CETAFLogo}
                                />
                            </Link>
                        </Col>
                        <Col>
                            <Row>
                                <Col xs={{ span: 12 }} lg="auto"
                                    className="d-flex flex-column justify-content-center"
                                >
                                    <Link to="/">
                                        <h2 className="w-auto fs-3 fs-lg-2 tc-primary fw-bold">
                                            Marketplace
                                        </h2>
                                        <h3 className="fs-4 fs-lg-3 tc-grey fw-lightBold">
                                            The Taxonomic Expertise and Services Marketplace
                                        </h3>
                                    </Link>
                                </Col>
                                {apiStatus !== 'available' &&
                                    <Col xs={{ span: 12 }} lg
                                        className="d-flex justify-content-end align-items-center mt-2 mt-lg-0"
                                    >
                                        <p className="tc-error fw-lightBold"><FontAwesomeIcon icon={faInfoCircle} /> {apiStatus === 'unreachable' ? 'Cannot reach the Marketplace API' : 'Some Marketplace data could not be loaded'}</p>
                                    </Col>
                                }
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default Header;