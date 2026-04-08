/* Import Dependencies */
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/* Import Store */
import { useAppSelector } from 'app/Hooks';
import { getTaxonomicServices } from 'redux-store/TaxonomicServiceSlice';
import { getTaxonomicExperts } from 'redux-store/TaxonomicExpertSlice';

/* Import Components */
import SearchResult from './SearchResult';

/* Import Styles */
import styles from 'components/search/search.module.scss';


/**
 * Component that renders the Search Results block on the Search page
 * @returns JSX.Component
 */
const SearchResults = () => {
    /* Base variables */
    const searchParams = new URLSearchParams(globalThis.location.search);
    const serviceType = searchParams.get('serviceType') === 'taxonomicExpert' ? 'taxonomicExperts' : 'taxonomicServices';
    const taxonomicExperts = useAppSelector(getTaxonomicExperts);
    const taxonomicServices = useAppSelector(getTaxonomicServices);

    if (serviceType === 'taxonomicExperts')
    {
        return (
            <Row>
            {taxonomicExperts.map((taxonomicExpert) => (
                <Col key={taxonomicExpert.taxonomicExpert['@id']}
                    lg={{ span: 4 }}
                    className="mb-4"
                >
                    <SearchResult taxonomicExpert={taxonomicExpert} />
                </Col>
            ))}
            </Row>
        );
    }
    else {
        const isReferenceCollection = searchParams.get('serviceType') === 'referenceCollection';

        return (
            <Row>
                {isReferenceCollection &&
                    <Col
                        lg={{ span: 4 }}
                        className="mb-4"
                    >
                        <Link to="/pollinator-collections">
                            <div className={`${styles.searchResult} w-100 bgc-white mt-lg-1 pt-3 pb-2 px-3`}>
                                <p className="fs-4 fs-lg-default fw-bold textOverflow tc-secondary">Pollinator Collection</p>
                                <p className="fs-5 fs-lg-4 mt-2">Linked pollinator collection descriptors and EuSurvey model.</p>
                            </div>
                        </Link>
                    </Col>
                }
                {taxonomicServices.map((taxonomicService) => (
                    <Col key={taxonomicService.taxonomicService['@id']}
                        lg={{ span: 4 }}
                        className="mb-4"
                    >
                        <SearchResult taxonomicService={taxonomicService} />
                    </Col>
                ))}
            </Row>
        );
    }
}

export default SearchResults;