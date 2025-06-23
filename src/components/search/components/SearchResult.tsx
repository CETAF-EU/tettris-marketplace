/* Import Dependencies */
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { format } from 'date-fns';
import { Row, Col } from 'react-bootstrap';

/* Import Hooks */
import { useAppDispatch } from 'app/Hooks';

/* Import Store */
import { setTaxonomicService } from 'redux-store/TaxonomicServiceSlice';
import { setTaxonomicExpert } from 'redux-store/TaxonomicExpertSlice';

/* Import Types */
import { TaxonomicExpert, TaxonomicService } from 'app/Types';

/* Import Styles */
import styles from 'components/search/search.module.scss';
import MarkdownIt from 'markdown-it';


/* Props Type */
type Props = {
    taxonomicService?: TaxonomicService
    taxonomicExpert?: TaxonomicExpert
};


/**
 * Component that renders an individual Search Result for on the search page
 * @param taxonomicService The Taxonomic Service that is represented by the Search Result
 * @returns JSX.Component
 */
const SearchResult = (props: Props) => {
    const { taxonomicService, taxonomicExpert } = props;

    /* Hooks */
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

  

    if (taxonomicService)
    {
        const id = taxonomicService.taxonomicService['@id'].replace(import.meta.env.VITE_HANDLE_URL as string, '');
        const url = `/ts/${id}`;

        const handleClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        data: TaxonomicService
        ) => {
            if (
                e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0
            ) return; // laisses le comportement natif (nouvel onglet, etc.)

            e.preventDefault();
            dispatch(setTaxonomicService(data));
            navigate(url);
        };

        /* Base variables */
        const logoImage: string | undefined = taxonomicService?.taxonomicService['schema:service']['schema:logo'];

        /* ClassNames */
        const imageColClass = classNames({
            'd-none d-lg-none': !logoImage,
            'd-none d-lg-flex': logoImage
        });

        const md = new MarkdownIt();
        const description = md.render(taxonomicService.taxonomicService['schema:service']['schema:description']);

        return (
            <div className={`${styles.searchResult} w-100 bgc-white mt-lg-1 pt-3 pb-2 px-3`}>
                <Link
                    to={url}
                    onClick={(e) => handleClick(e, taxonomicService)}
                >
                    <Row className="h-100">
                        {/* Basic column with all the details */}
                        <Col lg={{ ...(logoImage && { span: 8 }) }} className="h-100 d-flex flex-column">
                            {/* Title and language if image is not present */}
                            <Row>
                                <Col xs lg={{ span: (!logoImage || window.innerWidth < 768) ? 9 : 12 }}>
                                    <p className="fs-4 fs-lg-default fw-bold textOverflow">{taxonomicService.taxonomicService['schema:service']['schema:name']}</p>
                                </Col>
                                
                                    <Col xs="auto" lg={{ span: 3 }}
                                        className={!logoImage ? 'd-lg-block' : 'd-lg-none'}
                                    >
                                        <p className="fw-bold fs-5 fs-lg-4 text-end textOverflow">{taxonomicService.taxonomicService['schema:availableLanguage']?.join(' / ').toUpperCase()}</p>
                                    </Col>
                                
                            </Row>
                            {/* Taxonomic range */}
                            <Row>
                                <Col>
                                    <p className="fs-5 fs-lg-4 fst-italic textOverflow">{taxonomicService.taxonomicService['schema:taxonomicRange']?.toString()}</p>
                                </Col>
                            </Row>
                            {/* Description */}
                            <Row className='flex-grow-1 my-2'>
                                <Col>
                                    <p className={`${styles.searchResultDescription} h-100 fs-4`}><div dangerouslySetInnerHTML={{ __html: description }} /></p>
                                </Col>
                            </Row>
                            {/* Service Type and Publishing Date if preview image is not present */}
                            <Row>
                                <Col>
                                    <p className="fs-5 fs-lg-4">{taxonomicService.taxonomicService['schema:service']['schema:serviceType']}</p>
                                </Col>
                                <Col xs="auto" lg="auto"
                                    className={!logoImage ? 'd-lg-block' : 'd-lg-none'}
                                >
                                    <p className="fs-5 fs-lg-4 fw-bold">{taxonomicService.taxonomicService['schema:dateCreated'] &&
                                        format(taxonomicService.taxonomicService['schema:dateCreated'], 'MMM dd - yyyy')}
                                    </p>
                                </Col>
                            </Row>
                        </Col>
                        {/* If preview image is present, render this additional column which takes over some details from the original one */}
                        <Col lg={{ span: 4 }}
                            className={`${imageColClass} h-100 flex-column`}
                        >
                            {/* Language */}
                            <Row>
                                <Col className="d-flex justify-content-end">
                                    <p className="fw-bold fs-4">{taxonomicService.taxonomicService['schema:availableLanguage']?.join(' / ').toUpperCase()}</p>
                                </Col>
                            </Row>
                            {/* Logo, if present */}
                            {taxonomicService.taxonomicService['schema:service']['schema:logo'] &&
                                <Row className="flex-grow-1 overflow-hidden">
                                    <Col className="h-100">
                                        <div className="h-100 w-100 overflow-hidden">
                                            <img src={logoImage}
                                                alt={logoImage}
                                                className="h-100 w-100 object-fit-contain"
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            }
                            {/* Publishing Date */}
                            <Row>
                                <Col className="d-flex justify-content-end">
                                    <p className="fw-bold fs-4">{taxonomicService.taxonomicService['schema:dateCreated'] &&
                                        format(taxonomicService.taxonomicService['schema:dateCreated'], 'MMMM dd - yyyy')
                                    }</p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Link>
            </div >
        );
    }
    else if (taxonomicExpert) {
        /* Base variables */
        const logoImage = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:ProfilePicture'] as string || 'https://i.pinimg.com/236x/d9/d8/8e/d9d88e3d1f74e2b8ced3df051cecb81d.jpg';
        const id = taxonomicExpert.taxonomicExpert['@id'].replace(import.meta.env.VITE_HANDLE_URL as string, '');
        const url = `/te/${id}`;

        const handleClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        data: TaxonomicExpert
        ) => {
            if (
                e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0
            ) return; // laisses le comportement natif (nouvel onglet, etc.)

            e.preventDefault();
            dispatch(setTaxonomicExpert(data));
            navigate(url);
        };

        const name = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:name'] ?? '';
        const headline = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:headline'] ?? '';
        const location = taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:location'] ?? '';
        const languages = (taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:language'] || []).join(' / ').toUpperCase() || '';
        const discipline = taxonomicExpert?.taxonomicExpert?.['schema:Taxon']?.['schema:discipline'] || [];
        const subDiscipline = taxonomicExpert?.taxonomicExpert?.['schema:Taxon']?.['schema:additionalType'] || [];
        return (
            <div className={`${styles.searchResult} w-100 bgc-white mt-lg-1 pt-3 pb-2 px-3`}>
               <Link
                    to={url}
                    onClick={(e) => handleClick(e, taxonomicExpert)}
                >
                    <Col className="h-100 d-flex flex-column">
                        {/* Title, Headline */}
                        <Row className="mb-2">
                            <Col>
                                <p className="fs-4 fs-lg-default fw-bold textOverflow">{name}</p>
                                <p className="fs-6 fs-lg-4 textOverflow">{headline}</p>
                            </Col>
                        </Row>
                        {/*Taxonomic Range and profile picture */}
                        <Row className=' mb-1 justify-content-between'>
                            <Col>
                                <Row className='h-100'>
                                    <Col>
                                        <p className='fst-italic fs-4'>{discipline[0]}</p>
                                        <p className='fst-italic fs-4'>{discipline[1] ?? subDiscipline[0]}</p>
                                        <p className='fst-italic fs-4'>{discipline[2] ?? subDiscipline[1]}</p>
                                    </Col>
                                </Row>
                            </Col>
                            <Col className="d-flex justify-content-end">
                                <div
                                    style={{
                                        width: '5rem',
                                        height: '5rem',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    >
                                    <img
                                        src={logoImage}
                                        alt="Profile"
                                        style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain',
                                        display: 'block'
                                        }}
                                    />
                                    </div>
                            </Col>
                        </Row>
                        {/* Languages and countries */}
                        <Row >
                            <Col className='d-flex justify-content-start'>
                                <p className="fs-5 fs-lg-4">{languages}</p>
                            </Col>
                            <Col className="d-flex justify-content-end">
                                <p className="fw-bold fs-4">{location}</p>
                            </Col>
                        </Row>
                    </Col>
                </Link>
            </div >
            
        );
    }
    else {
        return (<></>);
    }
}

export default SearchResult;