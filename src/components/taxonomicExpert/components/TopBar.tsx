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
                <p className=' fs-lg-2 fw-bold'>{taxonomicExpert?.taxonomicExpert['schema:name']}</p>
            </Col>
            <Col>
                ORCID ID
            </Col>
            <Col>
                <p className=' fs-lg-2 fw-bold'>{taxonomicExpert?.taxonomicExpert['schema:location']}</p>
            </Col>
            <Col>
                <p className=' fs-lg-2 fw-bold'>{taxonomicExpert?.taxonomicExpert['schema:language']?.join(' / ').toUpperCase()}</p>
            </Col>
            <Col lg="auto" className="d-none d-lg-block">
                <Button type="submit" variant='tertiary'>
                    <p>EMAIL</p>
                </Button>
            </Col>
        </Row>
        <Row className="mb-3">
            <Col xs={{ span: 2 }}>
                <img src="https://www.w3schools.com/images/picture.jpg" alt="John Doe" style={{ width: '100px', height: '100px' }} />
            </Col>
            <Col xs={{ span: 8 }}>
                <Row className='mb-3 mt-3'>
                    <Col>
                        <p className='fs-lg-3 fw-bold'>{taxonomicExpert.taxonomicExpert['schema:headline']}</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>Institution</p>
                    </Col>
                    <Col>
                        <p>
                            <a href="url" target="_blank" rel="noopener noreferrer">
                                <i className="bi bi-link-45deg"></i>URL
                            </a>
                        </p>
                    </Col>
                    <Col>
                        <p>ROR ID</p>
                    </Col>
                </Row>
            </Col>
        </Row>
    </>);
}

export default TopBar;