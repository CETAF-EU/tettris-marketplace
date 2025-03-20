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

function extractRorId(url: string): string | null {
    const regex = /ror\.org\/([a-zA-Z0-9]+)/;
    const match = regex.exec(url);
    return match ? match[1] : null;
}


/**
 * Component that renders the Top Bar of the Taxonomic Expert page
 * @param taxonomicExpert The chosen Taxonomic Service
 * @returns JSX Component
 */
const TopBar = (props: Props) => {
    const { taxonomicExpert } = props;
    
    const name = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:name'] as string || 'Any name provided';
    const orcidID = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:identifier'] as string || null;
    const headline = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:headline'] as string || 'Any headline provided';
    const location = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:location'] as string || 'Any location provided';
    const language = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:language']?.join(' / ').toUpperCase() ?? 'Any languages provided';
    const email = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:email'] as string || null;
    const image = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:ProfilePicture'] as string || 'https://i.pinimg.com/236x/d9/d8/8e/d9d88e3d1f74e2b8ced3df051cecb81d.jpg';
    const affiliationName = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:affiliation']?.['schema:name'] as string || 'Any affiliation name provided';
    const affiliationURL = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:affiliation']?.['schema:identifier'] as string || null;
    const rorId = affiliationURL ? extractRorId(affiliationURL) : null;
    const affiliationURLText = affiliationURL ? taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:affiliation']?.['schema:url'] as string : null;
    const personalLinks = Array.isArray(taxonomicExpert?.taxonomicExpert?.['schema:person']?.["schema:links"])
        ? taxonomicExpert.taxonomicExpert['schema:person']["schema:links"].flat()
        : null;
    console.log(personalLinks);
    return (<>
        <Row className="mt-3 pt-lg-0">
            <Col lg="8">
                <Row>
                    <Col xs="auto" style={{ minWidth: '13rem', textAlign: 'center' }}>
                        <h1 className="fs-3 fs-lg-2">{name}</h1>
                    </Col>
                    <Col xs="auto" style={{ minWidth: '13rem', textAlign: 'center' }}>
                        {orcidID ? (
                            <a href={"https://orcid.org/" + orcidID} target="_blank" rel="noopener noreferrer">
                                <p className="fw-lightBold bi bi-link-45deg">{orcidID}</p>
                            </a>
                        ) : (
                            <p className="fw-lightBold bi bi-link-45deg">Any orcid ID provided</p>
                        )}
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
                    {email ? (
                        <a href={`mailto:${email}`} className=''>
                            <i className="bi bi-envelope-fill"></i> EMAIL
                        </a>
                    ) : (
                        <p>No email provided</p>
                    )}
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
                    <Col />
                    <Col className="fs-3 d-flex justify-content-center gap-2">
                        {Array.isArray(personalLinks) && personalLinks.some(link => link !== null) ? (
                            personalLinks.map((link) => (
                                link ? (
                                    <a key={link} href={link} target="_blank" rel="noopener noreferrer">
                                        <i className="bi bi-globe"> </i>
                                    </a>
                                ) : null
                            ))
                        ) : null}
                    </Col>
                </Row>
                <Row>
                    <Col xs="auto">
                        <p className="fw-lightBold"> {affiliationName}</p>
                    </Col>
                    <Col xs="2">
                        <p>
                            {affiliationURLText ? (
                                <a href={affiliationURLText} target="_blank" rel="noopener noreferrer">
                                    <i className="fw-lightBold bi bi-link-45deg"></i>URL
                                </a>
                            ) : (
                                <i className="fw-lightBold bi bi-link-45deg">No URL provided</i>
                            )}
                        </p>
                    </Col>
                    <Col>
                        <p>
                            {affiliationURL ? (
                                <a href={affiliationURL} target="_blank" rel="noopener noreferrer">
                                    <i className="fw-lightBold bi bi-link-45deg"></i>{rorId}
                                </a>
                            ) : (
                                <i className="fw-lightBold bi bi-link-45deg">No ROR ID provided</i>
                            )}
                        </p>
                    </Col>
                </Row>
            </Col>
        </Row>
    </>);
}

export default TopBar;