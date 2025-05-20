/* Import Dependencies */
import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

/* Import Hooks */
import { useAppDispatch, useFetch } from 'app/Hooks';

/* Import Store */
import { setIsApiOnline } from 'redux-store/AppStore';

/* Import Types */
import { Dict } from 'app/Types';

/* Import Styles */
import styles from './home.module.scss';

/* Import API */
import GetTaxonomicServices from 'api/taxonomicService/GetTaxonomicServices';
import GetTaxonomicExperts from 'api/taxonomicExpert/GetTaxonomicExperts';

/* Import Components */
import Header from "components/general/header/Header";
import HomeCategory from './components/HomeCategory';
import Footer from 'components/general/footer/Footer';


/**
 * Base component that renders the Home page
 * @returns JSX Component
 */
const Home = () => {
    /* Hooks */
    const dispatch = useAppDispatch();
    const fetch = useFetch();

    /* Base variables */
    const [counts, setCounts] = useState<Dict>({
        taxonomicServices: 0,
        referenceCollections: 0,
        taxonomicExpertise: 0
    });

    /* Fetch count for taxonomic services, reference collecitons and taxonomic expertise */
    fetch.FetchMultiple({
        callMethods: [
            {
                alias: 'taxonomicServices',
                Method: GetTaxonomicServices,
                params: {
                    pageSize: 1,
                    pageNumber: 0
                }
            },
            {
                alias: 'referenceCollections',
                Method: GetTaxonomicServices,
                params: {
                    pageSize: 1,
                    pageNumber: 0,
                    searchFilters: {
                        "schema:Service/schema:serviceType": 'referenceCollection'
                    }
                }
            },
            ...(import.meta.env.VITE_DEV === 'true' ? 
            [{
                alias: 'taxonomicExpertise',
                Method: GetTaxonomicExperts,
                params: {
                    pageSize: 1,
                    pageNumber: 0
                }
            }] : [])
        ],
        Handler: (results: { [alias: string]: { metadata: Dict } }) => {
            setCounts({
                taxonomicServices: results.taxonomicServices.metadata.totalRecords,
                referenceCollections: 0,
                taxonomicExpertise:  import.meta.env.VITE_DEV === 'true' ? results.taxonomicExpertise.metadata.totalRecords : 0,
            });
            dispatch(setIsApiOnline(true))
        },
        ErrorHandler: () => dispatch(setIsApiOnline(false))
    });

    return (
        <div className="h-100 d-flex flex-column">
            {/* Render Header */}
            <Header />

            {/* Home page body */}
            <div className="flex-grow-1 d-flex flex-column overflow-y-scroll overflow-x-hidden">
                {/* Home page body */}
                <Container fluid className="flex-lg-grow-1">
                    <Row className="h-100">
                        <Col className="h-100 d-flex flex-column">
                            {/* Big background image with Title and primary search bar */}
                            <Row className={`${styles.background} flex-lg-grow-1 py-5 py-lg-0 px-2 px-lg-0`}>
                                <Col lg={{ span: 10, offset: 1 }}
                                    className="h-100 d-flex flex-column justify-content-center"
                                >
                                    {/* Title */}
                                    <Row>
                                        <Col>
                                            {/* Desktop */}
                                            <h1 className="d-none d-lg-block fs-title tc-white fw-bold"
                                            >A hive for finding and supplying <br /> taxonomic expertise and services
                                            </h1>
                                            {/* Mobile */}
                                            <h1 className="d-block d-lg-none fs-2 tc-white fw-bold">
                                                A hive for finding <br /> and supplying <br /> taxonomic <br /> expertise <br /> and services
                                            </h1>

                                            <div className="bgc-white w-50 w-lg-25 pt-1 mt-3" />
                                        </Col>
                                    </Row>

                                    {/* Search Bar */}
                                    <Row className="h-25 h-lg-auto mt-5 px-3 px-lg-0">
                                        <Col xs={{ span: 12 }} lg={{ span: 5 }}
                                            className="position-relative mt-2 mt-lg-0"
                                        >
                                            <div className=" bgc-white-transparent bgc-lg-white-transparent py-3 px-3 position-absolute position-lg-static top-0 start-0 w-100 br-corner">
                                                <p className="fs-5 fs-lg-3">
                                                    Explore the Marketplace's catalog to discover taxonomic services offered by a wide range of organisations, 
                                                    explore the different reference collections and engage with fellow taxonomists to share expertise. 
                                                    Designed for taxonomists, this Marketplace will aid you in your important field of work.
                                                </p>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            {/* Search Category representation */}
                            <Row className="mt-5 mt-lg-0 px-2 px-lg-0">
                                <Col lg={{ span: 1 }}
                                    className="mt-4 mt-lg-0 p-0"
                                >
                                    <div className={`${styles.homeCategoryBar} bgc-grey d-none d-lg-block py-3`} />
                                </Col>
                                <Col lg={{ span: 10 }}
                                    className="mt-5 mt-lg-0"
                                >
                                    {/* Home category blocks */}
                                    <Row>
                                        <Col xs={{ span: 4 }}
                                            lg={{ span: 4 }}
                                        >
                                            <HomeCategory title="Taxonomic Services"
                                                subTitle="Go find"
                                                count={counts.taxonomicServices}
                                                link="/search"
                                                color="primary"
                                            />
                                        </Col>
                                        <Col xs={{ span: 4 }}
                                            lg={{ span: 4 }}
                                        >
                                            <HomeCategory title="Reference Collections"
                                                subTitle="Go explore"
                                                count={counts.referenceCollections}
                                                link={import.meta.env.VITE_DEV === 'true' ? "/search?serviceType=referenceCollection" : "/referenceCollection"}
                                                color="secondary"
                                            />
                                        </Col>
                                        <Col xs={{ span: 4 }}
                                            lg={{ span: 4 }}
                                        >
                                            <HomeCategory title="Expertise Taxonomists"
                                                subTitle="Go engage"
                                                count={counts.taxonomicExpertise}
                                                link={import.meta.env.VITE_DEV === 'true' ? "/search?serviceType=taxonomicExpert" : "/taxonomicExpert"}
                                                color="tertiary"
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg={{ span: 1 }} className="p-0">
                                    <div className={`${styles.homeCategoryBar} bgc-grey py-3 d-none d-lg-block`} />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>

                {/* Render Footer */}
                <div className="mt-auto">
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default Home;