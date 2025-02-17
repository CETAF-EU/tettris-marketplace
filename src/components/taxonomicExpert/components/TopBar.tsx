/* Import Dependencies */
import { Row, Col } from 'react-bootstrap';

/* Import Types */
import { TaxonomicExpert } from 'app/Types';

/* Import Components */
import { Button } from 'components/general/CustomComponents';


/* Props Type */
type Props = {
    taxonomicExpert: TaxonomicExpert
};


/**
 * Component that renders the Top Bar of the Taxonomic Expert page
 * @param taxonomicExpert The chosen Taxonomic Service
 * @returns JSX Component
 */
const TopBar = (props: Props) => {
    const { taxonomicExpert } = props;

    return (<>
        <Row className="mt-3 pt-lg-0">
            <Col>
            <h1 className="fs-3 fs-lg-2">{taxonomicExpert?.taxonomicExpert['schema:name']}</h1>
            </Col>
            <Col>
                <p className="fw-lightBold bi bi-link-45deg">ORCID ID</p>
            </Col>
            <Col>
                <p className='fw-lightBold bi bi-geo-alt-fill'>{taxonomicExpert?.taxonomicExpert['schema:location']}</p>
            </Col>
            <Col>
                <p className='fw-lightBold bi bi-globe2'> {taxonomicExpert?.taxonomicExpert['schema:language']?.join(' / ').toUpperCase()}</p>
            </Col>
            <Col lg="auto" className="d-none d-lg-block">
                <Button type="submit" variant='tertiary'>
                    <a href={`mailto:${taxonomicExpert?.taxonomicExpert['schema:email']}`} className=''>
                        <i className="bi bi-envelope-fill"></i> EMAIL
                    </a>
                </Button>
                
            </Col>
        </Row>
        <Row className="mb-3">
            <Col xs={{ span: 2 }}>
                <img src="https://www.w3schools.com/images/picture.jpg" alt="John Doe" style={{ width: '150px', height: '150px' }} />
            </Col>
            <Col xs={{ span: 8 }}>
                <Row className='mb-3 mt-3'>
                    <Col>
                        <p className="fs-3 fw-bold">{taxonomicExpert.taxonomicExpert['schema:headline']}</p>
                    </Col>
                    <Col className="d-flex justify-content-end">
                        <i className="bi bi-twitter mx-2"></i>
                        <i className="bi bi-linkedin mx-2"></i>
                        <i className="bi bi-github mx-2"></i>
                        <i className="bi bi-facebook mx-2"></i>
                    </Col>
                </Row>
                <Row>
                    <Col xs={{ span: 12 }} lg={{ span: 6 }}>
                        <p className="fw-lightBold"> Consortium of European Taxonomic Facilities</p>
                    </Col>
                    <Col>
                        <p>
                            <a href="url" target="_blank" rel="noopener noreferrer">
                                <i className="fw-lightBold bi bi-link-45deg"></i>URL
                            </a>
                        </p>
                    </Col>
                    <Col>
                        <p>
                            <a href="url" target="_blank" rel="noopener noreferrer">
                                <i className="fw-lightBold bi bi-link-45deg"></i>ROR ID
                            </a>
                        </p>
                    </Col>
                </Row>
            </Col>
        </Row>
    </>);
}

export default TopBar;