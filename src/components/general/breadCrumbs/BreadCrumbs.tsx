/* Import Dependencies */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row, Col } from 'react-bootstrap';
import { useLocation, Link } from "react-router-dom";

/* Import Hooks */
import { useAppSelector } from 'app/Hooks';

/* Import Store */
import { getTaxonomicService } from 'redux-store/TaxonomicServiceSlice';
import { getTaxonomicExpert } from 'redux-store/TaxonomicExpertSlice';

/* Import Icons */
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';


/* Bread crumb type */
type BreadCrumb = {
    crumb: string,
    path?: string
}


/**
 * Component that renders bread crumbs based upon the current location
 * @returns JSX Component
 */
const BreadCrumbs = () => {
    /* Hooks */
    const location = useLocation();

    /* Base variables */
    const taxonomicService = useAppSelector(getTaxonomicService);
    const taxonomicExpert = useAppSelector(getTaxonomicExpert);
    const breadCrumbs: BreadCrumb[] = [];

    /* Construct bread crumbs based on location */
    location.pathname.slice(1).split('/').forEach((pathPart) => {
        switch (pathPart) {
            case 'search': {
                breadCrumbs.push({
                    crumb: 'Taxonomic Services',
                    path: '/search'
                });

                if (location.pathname.includes('compare')) {
                    breadCrumbs.push({
                        crumb: 'Compare'
                    });
                };

                break;
            } case 'ts': {
                breadCrumbs.push({
                    crumb: 'Taxonomic Services',
                    path: '/search'
                });

                if (location.pathname.includes('suggestNewTaxonomicService')) {
                    breadCrumbs.push({
                        crumb: 'Suggest new taxonomic service'
                    });
                } else {
                    breadCrumbs.push({
                        crumb: `${taxonomicService?.taxonomicService['schema:service']?.['schema:name']}`
                    });
                }

                break;
            }  case 'te': {
                breadCrumbs.push({
                    crumb: 'Taxonomic Experts',
                    path: '/search?serviceType=taxonomicExpert'
                });

                if (location.pathname.includes('registerYourExpertise')) {
                    breadCrumbs.push({
                        crumb: 'Register your expertise'
                    });
                } else {
                    breadCrumbs.push({
                        crumb: `${taxonomicExpert?.taxonomicExpert?.['schema:person']?.['schema:name'] ?? ''}`
                    });
                }
            }
        };
    });

    const serviceTypeClass = classNames({
        'tc-primary': location.pathname.includes('/ts'),
        'tc-tertiary': location.pathname.includes('/te'),
        'tc-secondary': !location.pathname.includes('/ts') && !location.pathname.includes('/te')
    });

    return (
        <div>
            <Row>
                {breadCrumbs.map((breadCrumb, index) => (
                    <Col key={breadCrumb.crumb}
                        xs="auto"
                        lg="auto"
                        className={`${index > 0 ? 'ps-0' : ''} pe-0`}
                    >
                        {/* Add arrow in between crumbs if index is greater than zero */}
                        {(index > 0) &&
                            <FontAwesomeIcon icon={faChevronRight}
                                className={`${serviceTypeClass} fs-4 fw-lightBold pe-2`}
                            />
                        }

                        {/* Bread crumb */}
                        {breadCrumb.path ?
                            <Link to={breadCrumb.path}>
                                <span className={`${serviceTypeClass} fs-5 fs-lg-4 fw-lightBold pe-2`}>{breadCrumb.crumb}</span>
                            </Link>
                            : <span className={`${serviceTypeClass} fs-5 fs-lg-4 fw-lightBold pe-2`}>{breadCrumb.crumb}</span>
                        }
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default BreadCrumbs;