/* Import Dependencies */
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';

/* Import Hooks */
import { usePaginator, useAppDispatch } from 'app/Hooks';

/* Import Store */
import { setIsApiOnline } from 'redux-store/AppStore';
import { setTaxonomicServices, concatToTaxonomicServices } from 'redux-store/TaxonomicServiceSlice';
import { setTaxonomicExperts, concatToTaxonomicExperts } from 'redux-store/TaxonomicExpertSlice';

/* Import Types */
import { TaxonomicService, TaxonomicExpert } from 'app/Types';

/* Import API */
import GetTaxonomicServices from 'api/taxonomicService/GetTaxonomicServices';
import GetTaxonomicExperts from 'api/taxonomicExpert/GetTaxonomicExperts';

/* Import Components */
import Header from 'components/general/header/Header';
import TopBar from './components/TopBar';
import FiltersBar from './components/FiltersBar';
import SearchResults from './components/SearchResults';
import Footer from 'components/general/footer/Footer';
import { Button, Spinner } from 'components/general/CustomComponents';
import { Color, getColor } from 'components/general/ColorPage';


/**
 * Base component that returns the Search page
 * @returns JSX.Component
 */
const Search = () => {
    /* Hooks */
    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();
    const [noMoreResults, setNoMoreResults] = useState<boolean>(false);

    /* Base variables */
    const serviceType = searchParams.get('serviceType');
    const isTaxonomicExpert = serviceType === 'taxonomicExpert';

    const paginator = usePaginator({
        Initiate: () => {
            dispatch(isTaxonomicExpert ? setTaxonomicExperts([]) : setTaxonomicServices([]));
            setNoMoreResults(false);
        },
        Method: isTaxonomicExpert ? GetTaxonomicExperts : GetTaxonomicServices,
        Handler: (records: TaxonomicExpert[] | TaxonomicService[]) => {
            if (isTaxonomicExpert) {
                dispatch(concatToTaxonomicExperts(records as TaxonomicExpert[]));
            } else {
                dispatch(concatToTaxonomicServices(records as TaxonomicService[]));
            }
            dispatch(setIsApiOnline(true));

            if (!records.length) {
                setNoMoreResults(true);
            }
        },
        ErrorHandler: () => {
            dispatch(setIsApiOnline(false));
        },
        pageSize: 12,
        resultKey: isTaxonomicExpert ? 'taxonomicExperts' : 'taxonomicServices',
        allowSearchParams: true
    });

    /* On search: check if there are any more records to be shown with the show more button */
    useEffect(() => {
        if (!noMoreResults) {
            const searchFilters = [...searchParams.entries()].reduce((filtersObject, [key, value]) => {
                const previousValue = filtersObject[key];

                if (!previousValue) {
                    return {
                        ...filtersObject,
                        [key]: value
                    }
                }

                return {
                    ...filtersObject,
                    [key]: Array.isArray(previousValue) ? [...previousValue, value] : [previousValue, value]
                }
            }, {} as { [searchFilter: string]: string | string[] });

            if (searchParams.get('serviceType') === 'taxonomicExpert') {
                GetTaxonomicExperts({
                    pageNumber: paginator.currentPage + 1,
                    pageSize: 12,
                    searchFilters
                }).then(({ taxonomicExperts }) => {
                    if (!taxonomicExperts.length) {
                        setNoMoreResults(true);
                    }
                });
            }
            else {
                GetTaxonomicServices({
                    pageNumber: paginator.currentPage + 1,
                    pageSize: 12,
                    searchFilters
                }).then(({ taxonomicServices }) => {
                    if (!taxonomicServices.length) {
                        setNoMoreResults(true);
                    }
                });
            }
        }
    }, [paginator]);

    const variant: Color = getColor(globalThis.location) as Color;
    
    /* ClassNames */
    const searchResultsClassScrollBlock = classNames({
        'overflow-x-hidden': paginator.totalRecords,
        'overflow-hidden': !paginator.totalRecords
    });

    const searchResultsClass = classNames({
        'h-100': !paginator.totalRecords && !paginator.errorMessage
    });

    const loadMoreBlockClass = classNames({
        'flex-grow-1': !paginator.loading && paginator.errorMessage,
        'mb-4': !paginator.errorMessage
    });

    return (
        <div className="h-100 d-flex flex-column">
            {/* Render Header */}
            <Header />

            {/* Home page Body */}
            <Container fluid className={`gradient-${variant} flex-grow-1 overflow-hidden tr-smooth`}>
                <Row className="h-100">
                    <Col lg={{ span: 10, offset: 1 }}
                        className="h-100 d-flex flex-column pt-5 px-4 px-lg-3"
                    >
                        {/* Top Bar */}
                        <Row>
                            <Col>
                                <TopBar />
                            </Col>
                        </Row>
                        {/* Filters Bar */}
                        <Row className="mt-1 d-none d-lg-flex">
                            <Col>
                                <FiltersBar />
                            </Col>
                        </Row>
                        {/* link to pollinator collections data */}
                        {!searchParams.get('serviceType') && (
                            <Row className="mt-3">
                                <Col>
                                    <p className="mb-0 fs-4 fw-lightBold">
                                        Looking for linked pollinator collection descriptors and the EuSurvey model used to collect them ?{' '}
                                        <Link to="/pollinator-collections" className="tc-secondary">
                                            Open the dedicated page
                                        </Link>.
                                    </p>
                                </Col>
                            </Row>
                        )}
                        {!searchParams.get('serviceType') && <div className="mt-2" />}
                        {/* Results Count */}
                        <Row className="mt-2">
                            <Col>
                                <p className="fs-4 fw-lightBold">{`${paginator.totalRecords ?? 0} results`}</p>
                            </Col>
                        </Row>
                        {/* Search Results body */}
                        <Row className={`${searchResultsClassScrollBlock} flex-grow-1 mt-4 mb-4`}>
                            <Col className="h-100 d-flex flex-column">
                                {/* Search Result blocks */}
                                <Row className={searchResultsClass}>
                                    <Col>
                                        {paginator.totalRecords === 0 ?
                                            <Row className="h-100 align-items-center">
                                                <Col>
                                                    <p className="text-center">No records found</p>
                                                </Col>
                                            </Row>
                                            : <SearchResults />
                                        }
                                    </Col>
                                </Row>
                                {/* Load more button */}
                                <Row className={loadMoreBlockClass}>
                                    <Col className="d-flex justify-content-center">
                                        {(!paginator.loading && !noMoreResults && paginator.totalRecords > 0) &&
                                            <Button type="button"
                                                variant={variant}
                                                OnClick={() => paginator.Next?.()}
                                            >
                                                Load more
                                            </Button>
                                        }
                                        {(!paginator.loading && noMoreResults && paginator.totalRecords > 0) &&
                                            <Row className="h-100 align-items-center">
                                                <Col>
                                                    <p>{`No ${paginator.totalRecords > 0 ? 'more ' : ''}results found`}</p>
                                                </Col>
                                            </Row>
                                        }
                                        {paginator.loading &&
                                            <Spinner />
                                        }
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>

            {/* Render Footer */}
            <Footer />
        </div >
    );
};

export default Search;
