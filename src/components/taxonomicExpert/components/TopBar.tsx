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
    const orcidID = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:orcid'] as string || null;
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
    const datePublished = taxonomicExpert?.taxonomicExpert?.['schema:datePublished'] as string || null;
    return (<>
        <Col lg='auto' className="mb-3">
            <Row className="text-center">
                <h1 className="fs-2">{name}</h1>
            </Row>
            <Row className='justify-content-center'>
                <img className="h-100 w-100 object-fit-contain" src={image} alt={name} style={{ maxWidth: '10rem', aspectRatio: '1 / 1'}} />
            </Row>
        </Col>
        <Col lg="6" className='mt-1'>
            <Row className="justify-content-center text-center text-md-start">
                <Col xs={12} md="auto"> 
                    {orcidID ? (
                    <a href={"https://orcid.org/" + orcidID} target="_blank" rel="noopener noreferrer">
                        <p className="fw-lightBold bi bi-link-45deg"> ORCID number</p>
                    </a>
                    ) : (
                    <p className="fw-lightBold bi bi-link-45deg"> Any orcid ID provided</p>
                    )}
                </Col>
                <Col xs={12} md="auto">
                    <p className="fw-lightBold bi bi-geo-alt-fill"> {location}</p>
                </Col>
                <Col xs={12} md="auto">
                    <p className="fw-lightBold bi bi-globe2"> {language}</p>
                </Col>
            </Row>
            <Row className="justify-content-center text-center custom-justify">
                <Col xs={12}>
                    <Row className="mt-5 d-none d-md-flex" />

                    <Row className="mt-1 mb-3 justify-content-center custom-justify">
                        <Col xs="auto">
                            <p className="fs-3 fw-bold text-center">{headline}</p>
                        </Col>
                    </Row>
                    <Row className="justify-content-center text-center custom-justify">
                        <Col xs={12} md="auto">
                            <p className="fw-lightBold mb-1">{affiliationName}</p>
                        </Col>
                        <Col xs={12} md="auto">
                            {affiliationURLText ? (
                            <a href={affiliationURLText} target="_blank" rel="noopener noreferrer">
                                <i className="fw-lightBold bi bi-link-45deg"></i> URL
                            </a>
                            ) : (
                            <i className="fw-lightBold bi bi-link-45deg">No URL provided</i>
                            )}
                        </Col>
                        <Col xs={12} md="auto">
                            {affiliationURL ? (
                            <a href={affiliationURL} target="_blank" rel="noopener noreferrer">
                                <i className="fw-lightBold bi bi-link-45deg"> ROR ID</i>
                            </a>
                            ) : (
                            <i className="fw-lightBold bi bi-link-45deg">No ROR ID provided</i>
                            )}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Col>
        <Col lg="2" className="d-none d-lg-block"></Col>
        <Col lg="2" className="mt-1">
            <Row className="justify-content-center text-center">
                <Col xs="auto">
                    {email ? (
                        <Button type="submit" variant='tertiary'>
                            <a href={`mailto:${email}`} className=''>
                                <i className="bi bi-envelope-fill"></i> EMAIL
                            </a>
                        </Button>
                    ) : (
                        <p>No email provided</p>
                    )}
                </Col>
            </Row>
            <Row className="justify-content-center text-center mt-3 mb-3">
                <Col xs="auto" className="d-flex justify-content-center gap-2">
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
            <Row className="justify-content-center text-center mt-5 mb-3">
                <Col xs="auto" className='text-center'>
                    {datePublished ? (
                        <p className="fw-lightBold">Last update on {new Date(datePublished).toLocaleDateString()}</p>
                    ) : (
                        <p className="fw-lightBold">No update date provided</p>)}
                </Col>
            </Row>
        </Col>
    </>);
}

export default TopBar;