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
    
    const name = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:name'] as string || '';
    const headline = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:headline'] as string || '';
    const location = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:location'] as string || '';
    const language = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:language']?.join(' / ').toUpperCase() || '';
    const email = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:email'] as string || '';
    const image = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:ProfilePicture'] as string || 'https://i.pinimg.com/236x/d9/d8/8e/d9d88e3d1f74e2b8ced3df051cecb81d.jpg';

    return (<>
        <Row className="mt-3 pt-lg-0">
            <Col lg="8">
                <Row>
                    <Col xs="auto" style={{ minWidth: '13rem', textAlign: 'center' }}>
                        <h1 className="fs-3 fs-lg-2">{name}</h1>
                    </Col>
                    <Col xs="auto" style={{ minWidth: '13rem', textAlign: 'center' }}>
                        <p className="fw-lightBold bi bi-link-45deg">ORCID ID</p>
                    </Col>
                    <Col xs="auto" style={{ minWidth: '13rem', textAlign: 'center' }}>
                        <p className='fw-lightBold bi bi-geo-alt-fill'>{location}</p>
                    </Col>
                    <Col xs="auto" style={{ minWidth: '13rem', textAlign: 'center' }}>
                        <p className='fw-lightBold bi bi-globe2'> {language}</p>
                    </Col>
                </Row>
            </Col>
            <Col lg="2" className="d-none d-lg-block"/>
            <Col lg="auto" className="d-none d-lg-block ">
                <Button type="submit" variant='tertiary'>
                    <a href={`mailto:${email}`} className=''>
                        <i className="bi bi-envelope-fill"></i> EMAIL
                    </a>
                </Button>

            </Col>
        </Row>
        <Row className="mb-3 pt-lg-0">
            <Col lg="auto">
                <img src={image} alt="John Doe" style={{ width: '12rem', height: '12rem' }} />
            </Col>
            <Col className='ms-3'>
                <Row className='mb-3 mt-3'>
                    <Col>
                        <p className="fs-3 fw-bold">{headline}</p>
                    </Col>
                    <Col className="fs-3 d-flex justify-content-end me-2">
                        <i className="bi bi-twitter mx-1"></i>
                        <i className="bi bi-linkedin mx-1"></i>
                        <i className="bi bi-github mx-1"></i>
                        <i className="bi bi-facebook mx-1"></i>
                    </Col>
                    <Col lg='1' />
                </Row>
                <Row>
                    <Col xs="4">
                        <p className="fw-lightBold"> Consortium of European Taxonomic Facilities</p>
                    </Col>
                    <Col xs="2">
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