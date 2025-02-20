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

    return (<>
        <Row className="mt-3 pt-lg-0">
            <Col lg="8">
                <Row className='ms-2'>
                    <Col xs="2">
                        <h1 className="fs-3 fs-lg-2">{name}</h1>
                    </Col>
                    <Col xs="2">
                        <p className="fw-lightBold bi bi-link-45deg">ORCID ID</p>
                    </Col>
                    <Col xs="2">
                        <p className='fw-lightBold bi bi-geo-alt-fill'>{location}</p>
                    </Col>
                    <Col>
                        <p className='fw-lightBold bi bi-globe2'> {language}</p>
                    </Col>
                </Row>
            </Col>
            <Col lg="2" className="d-none d-lg-block"/>
            <Col lg="auto" className="d-none d-lg-block ">
                <Button type="submit" variant='tertiary'>
                    <a href={`mailto:${taxonomicExpert?.taxonomicExpert['schema:email']}`} className=''>
                        <i className="bi bi-envelope-fill"></i> EMAIL
                    </a>
                </Button>

            </Col>
        </Row>
        <Row className="mb-3 pt-lg-0">
            <Col lg="auto">
                <img src="https://static1.purepeople.com/people/9/39/@/5118785-brad-pitt-septembre-2019-200x200-2.jpg" alt="John Doe" style={{ width: '150px', height: '150px' }} />
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