/* Import Dependencies */
import { Row, Col } from 'react-bootstrap';

/* Import Types */
import { TaxonomicExpert } from 'app/Types';

/* Import Components */
import { Button } from 'components/general/CustomComponents';

const getIconClass = (link: string) => {
    const iconMap: { [key: string]: string } = {
        'github.com': "bi bi-github p-1",
        'linkedin.com': "bi bi-linkedin p-1",
        'twitter.com': "bi bi-twitter p-1",
        'facebook.com': "bi bi-facebook p-1",
        'instagram.com': "bi bi-instagram p-1",
        'youtube.com': "bi bi-youtube p-1",
        'tiktok.com': "bi bi-tiktok p-1",
        'pinterest.com': "bi bi-pinterest p-1",
        'reddit.com': "bi bi-reddit p-1",
        'medium.com': "bi bi-medium p-1",
        'snapchat.com': "bi bi-snapchat p-1",
        'tumblr.com': "bi bi-tumblr p-1",
        'whatsapp.com': "bi bi-whatsapp p-1",
        'telegram.org': "bi bi-telegram p-1",
        'discord.com': "bi bi-discord p-1",
        'slack.com': "bi bi-slack p-1",
        'dribbble.com': "bi bi-dribbble p-1",
        'behance.net': "bi bi-behance p-1",
        'flickr.com': "bi bi-flickr p-1",
        'quora.com': "bi bi-quora p-1",
    };

    for (const domain in iconMap) {
        if (link.includes(domain)) {
            return iconMap[domain];
        }
    }
    return "bi bi-globe p-1";
};

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
    
    const name = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:name'] as string || 'Any name provided';
    const orcidID = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:identifier'] as string || null;
    const headline = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:headline'] as string || 'Any headline provided';
    const location = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:location'] as string || 'Any location provided';
    const language = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:language']?.join(' / ').toUpperCase() ?? 'Any languages provided';
    const email = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:email'] as string || null;
    const image = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:ProfilePicture'] as string || 'https://i.pinimg.com/236x/d9/d8/8e/d9d88e3d1f74e2b8ced3df051cecb81d.jpg';
    const affiliationName = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:affiliation']?.['schema:name'] as string || 'Any affiliation name provided';
    const affiliationURL = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:affiliation']?.['schema:identifier'] as string || null;
    const affiliationURLText = affiliationURL ? taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:affiliation']?.['schema:url'] as string : null;
    const personalLinks = Array.isArray(taxonomicExpert?.taxonomicExpert?.['schema:person']?.["schema:links"])
        ? taxonomicExpert.taxonomicExpert['schema:person']["schema:links"].flat()
        : null;
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
            <Col className='ms-2'>
                <Row className='mb-3 mt-3'>
                    <Col>
                        <p className="fs-3 fw-bold">{headline}</p>
                    </Col>
                    <Col className="fs-3 d-flex justify-content-end gap-2" style={{ marginRight: '7rem' }}>
                        {Array.isArray(personalLinks) && personalLinks.some(link => link !== null) ? (
                            personalLinks.map((link) => (
                                link ? (
                                    <a key={link} href={link} target="_blank" rel="noopener noreferrer">
                                        <i className={getIconClass(link)}></i>
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
                                    <i className="fw-lightBold bi bi-link-45deg"> ROR ID</i>
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