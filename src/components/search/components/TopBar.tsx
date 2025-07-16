/* Import Dependencies */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

/* Import Hooks */
import { useFocus } from 'app/Hooks';

/* Import Icons */
import { faFilter, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';

/* Import Styles */
import styles from 'components/search/search.module.scss';

/* Import Components */
import FiltersBar from './FiltersBar';
import { Button } from 'components/general/CustomComponents';
import { Color, getColor } from 'components/general/ColorPage';


/** Component that renders the Top Bar of the Search page,
 * containing a title and the option to suggest new taxonomic services
*/
const TopBar = () => {
    /* Hooks */
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    /* Base variables */
    const [filtersToggle, setFiltersToggle] = useState<boolean>(false);

    /* Create ref and focus for mobile filters */
    const filtersRef = useRef<HTMLDivElement>(null);
    useFocus({ ref: filtersRef, OnFocusLose: () => setFiltersToggle(false) });

    /* Class Names */
    const filtersClass = classNames({
        [`${styles.topBarFilters}`]: true,
        'd-none': !filtersToggle,
        'd-block': filtersToggle
    });

    /* variable */
    let textButton = "Suggest a new service"
    let path = "/ts/suggestNewTaxonomicService" 
    if (searchParams.get('serviceType') === 'referenceCollection') {
        textButton = "Suggest a new reference collection"        
    }
    else if (searchParams.get('serviceType') === 'taxonomicExpert') {
        textButton = "Add my expertise"
        path = "/te/registerYourExpertise"
    }
    const variant: Color = getColor(window.location) as Color;


    return (
        <div className="position-relative">
            <Row>
                <Col xs={{ span: 12 }} lg>
                    <h1 className="fs-3 fs-lg-2 fw-lightBold">
                        Browse the catalog
                    </h1>
                </Col>
                {/* Display filters menu, if device is mobile */}
                <Col xs
                    className="d-block d-lg-none"
                >
                    <Button type="button"
                        variant={variant}
                        className="fs-5 mt-3"
                        OnClick={() => setFiltersToggle(!filtersToggle)}
                    >
                        <>
                            <span className="pe-2">Filters</span>
                            <FontAwesomeIcon icon={faFilter} />
                        </>
                    </Button>
                    <Button type="button"
                        variant="primary"
                        className="bgc-error fs-5 ms-2 mt-3"
                        OnClick={() => setSearchParams(searchParams.get('serviceType') === 'referenceCollection' ? { serviceType: 'referenceCollection' } : searchParams.get('serviceType') === 'taxonomicExpert' ? { serviceType: 'taxonomicExpert' } : {})}
                    >
                        <FontAwesomeIcon icon={faFilterCircleXmark} />
                    </Button>

                    {/* Absolute position filters bar */}
                    <div ref={filtersRef}
                        className={`${filtersClass} position-absolute z-1 bgc-grey-light mt-3 px-3 py-3`}
                    >
                        <FiltersBar ToggleFilters={() => setFiltersToggle(!filtersToggle)} />
                    </div>
                </Col>
                <Col xs="auto" lg="auto"
                    className="mt-3 mt-lg-0"
                >
                    <Button type="button"
                        variant={variant}
                        className="fs-5 fs-lg-4"
                        OnClick={() => navigate(path)}
                    >
                        {textButton}
                    </Button>
                </Col>
            </Row>
        </div>
    );
}

export default TopBar;