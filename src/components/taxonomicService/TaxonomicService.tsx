/* Import Dependencies */
import classNames from 'classnames';
import { format } from 'date-fns';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

/* Import Hooks */
import { useAppSelector, useAppDispatch, useFetch } from 'app/Hooks';

/* Import Store */
import { setIsApiOnline } from 'redux-store/AppStore';
import { getTaxonomicService, setTaxonomicService } from 'redux-store/TaxonomicServiceSlice';

/* Import Types */
import { TaxonomicService as TaxonomicServiceType, Funder, Dict } from 'app/Types';

/* Import API */
import GetTaxonomicService from 'api/taxonomicService/GetTaxonomicService';

/* Import Components */
import Header from 'components/general/header/Header';
import TopBar from './components/TopBar';
import DescriptionBlock from './components/DescriptionBlock';
import DetailsBlock from './components/DetailsBlock';
import MultimediaBlock from './components/MultimediaBlock';
import Footer from 'components/general/footer/Footer';
import { BreadCrumbs, Spinner } from 'components/general/CustomComponents';


const TaxonomicService = () => {
    /* Hooks */
    const dispatch = useAppDispatch();
    const params = useParams();
    const fetch = useFetch();

    /* Base variables */
    const taxonomicService: TaxonomicServiceType | undefined = useAppSelector(getTaxonomicService);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [displaySpinner, setDisplaySpinner] = useState<boolean>(false);
    const taxonomicServiceID: string = `${params.prefix}/${params.suffix}`;

    /* Fetch taxonomic service */
    fetch.Fetch({
        Method: GetTaxonomicService,
        Handler: (taxonomicService: TaxonomicServiceType) => {
            dispatch(setTaxonomicService(taxonomicService));
            dispatch(setIsApiOnline(true));
        },
        ErrorHandler: (error: Error) => {
            setErrorMessage(error.message);

            if (error?.cause !== 200) {
                dispatch(setIsApiOnline(false));
            }
        },
        params: { handle: taxonomicServiceID }
    });

    /* Time out to check if the taxonomic service is still being loaded after 1.5 seconds */
    setTimeout(() => {
        if (fetch.loading) {
            setDisplaySpinner(true);
        };
    }, 1500);

    /* ClassNames */
    const detailBlocksClass = classNames({
        'pt-4': !taxonomicService?.taxonomicService['schema:AssociatedMedia']
    });
    
    return (
        <div className="h-100 d-flex flex-column">
            {/* Render Header */}
            <Header />

            {/* Home page Body */}
            <Container fluid className="flex-grow-1 overflow-hidden">
                <Row className="h-100">
                    <Col lg={{ span: 10, offset: 1 }}
                        className="h-100 d-flex flex-column pt-3 pt-lg-5 px-4 px-lg-3"
                    >
                        {/* If data is still being loaded after 1.5 seconds, display spinner */}
                        {(fetch.loading && displaySpinner) &&
                            <Row className="flex-grow-1">
                                <Col className="d-flex justify-content-center align-items-center">
                                    <div className="text-center">
                                        <p className="fs-2 fw-lightBold pb-2">Loading Taxonomic Service</p>
                                        <Spinner />
                                    </div>
                                </Col>
                            </Row>
                        }
                        {/* If taxonomic service is present */}
                        {taxonomicService &&
                            <>
                                {/* Bread crumbs */}
                                <Row>
                                    <Col>
                                        <BreadCrumbs />
                                    </Col>
                                </Row>
                                {/* Top bar */}
                                <Row className="mt-3 pt-lg-0">
                                    <Col>
                                        <TopBar taxonomicService={taxonomicService} />
                                    </Col>
                                </Row>
                                {/* Scrollable content */}
                                <Row className="flex-grow-1 overflow-scroll mt-3 mb-3">
                                    <Col>
                                        {/* Description block */}
                                        <Row>
                                            <Col>
                                                <DescriptionBlock taxonomicService={taxonomicService} />
                                            </Col>
                                        </Row>
                                        {/* Detail blocks */}
                                        <Row className={`${detailBlocksClass} mt-4`}>
                                            <Col xs={{ span: 12 }}
                                                lg={{ span: 4 }}
                                                className="mb-lg-3"
                                            >
                                                <DetailsBlock name="Service Details"
                                                    properties={{
                                                        topicDiscipline: taxonomicService.taxonomicService['ods:topicDiscipline'],
                                                        organismGroup: taxonomicService.taxonomicService['schema:additionalProperty']?.[0] as string[] | undefined,
                                                        geographicArea: taxonomicService.taxonomicService['schema:geographicArea'],
                                                        licence: taxonomicService.taxonomicService['schema:license'],
                                                        sourceURL: taxonomicService.taxonomicService['schema:url'],
                                                        changeLog: taxonomicService.taxonomicService['schema:about'],
                                                        datePublished: taxonomicService.taxonomicService['schema:datePublished'] && format(taxonomicService.taxonomicService['schema:datePublished'], 'MMMM dd - yyyy'),
                                                        availableOnAppStore: taxonomicService.taxonomicService['schema:additionalProperty']?.[1] as string[] | undefined,
                                                        documentationURL: taxonomicService.taxonomicService['schema:documentation'],
                                                        paymentModel: taxonomicService.taxonomicService['schema:additionalProperty']?.[2] as string | undefined,
                                                        termsOfService: taxonomicService.taxonomicService['schema:service']['schema:termsOfService'],
                                                        updateFrequency: taxonomicService.taxonomicService['schema:service']['schema:additionalProperty']?.[0] as string | undefined
                                                    }}
                                                />
                                            </Col>
                                            <Col xs={{ span: 12 }}
                                                lg={{ span: 4 }}
                                                className="mt-4 mt-lg-0 mb-lg-3"
                                            >
                                                <DetailsBlock name="Contact Information"
                                                    properties={{
                                                        contactEmail: taxonomicService.taxonomicService['schema:contactPoint']?.['schema:email'],
                                                        contactWebpage: taxonomicService.taxonomicService['schema:contactPoint']?.['schema:url'],
                                                        authors: taxonomicService.taxonomicService['schema:author'],
                                                        maintainers: taxonomicService.taxonomicService['schema:maintainer'],
                                                    }}
                                                />
                                            </Col>
                                            {/* Show software details if software object is present in taxonomic service */}
                                            {taxonomicService.taxonomicService['schema:softwareSourceCode'] &&
                                                <Col xs={{ span: 12 }}
                                                    lg={{ span: 4 }}
                                                    className="mt-4 mt-lg-0 mb-lg-3"
                                                >
                                                    <DetailsBlock name="Software"
                                                        properties={{
                                                            codeRepository: taxonomicService.taxonomicService['schema:softwareSourceCode']['schema:codeRepository'],
                                                            runtimePlatform: taxonomicService.taxonomicService['schema:softwareSourceCode']['schema:runtimePlatform'],
                                                            status: taxonomicService.taxonomicService['schema:softwareSourceCode']['schema:creativeWorkStatus'],
                                                            programmingLanguages: taxonomicService.taxonomicService['schema:softwareSourceCode']['schema:programmingLanguage'],
                                                            softwareLicense: taxonomicService.taxonomicService['schema:softwareSourceCode']['schema:license'],
                                                            isOpenSource: taxonomicService.taxonomicService['schema:softwareSourceCode']['schema:additionalProperty']?.[0] ? 'True' : 'False'
                                                        }}
                                                    />
                                                </Col>
                                            }
                                            {/* Show funding details if funding object is present in taxonomic service */}
                                            {(taxonomicService.taxonomicService['schema:fundingScheme'] &&
                                                 (taxonomicService.taxonomicService['schema:fundingScheme']['schema:award'] ||
                                                 taxonomicService.taxonomicService['schema:fundingScheme']['schema:funding']?.['schema:identifier'] ||
                                                 taxonomicService.taxonomicService['schema:fundingScheme']['schema:funding']?.['schema:description'] ||
                                                 taxonomicService.taxonomicService['schema:fundingScheme']['schema:funder'])) &&
                                                <Col xs={{ span: 12 }}
                                                    lg={{ span: 4 }}
                                                    className="mt-4 mt-lg-0 mb-lg-3"
                                                >
                                                    <DetailsBlock name="Funding"
                                                        properties={{
                                                            award: taxonomicService.taxonomicService['schema:fundingScheme']['schema:award'],
                                                            fundingId: taxonomicService.taxonomicService['schema:fundingScheme']['schema:funding']?.['schema:identifier'],
                                                            fundingDescription: taxonomicService.taxonomicService['schema:fundingScheme']['schema:funding']?.['schema:description'],
                                                            funders: taxonomicService.taxonomicService['schema:fundingScheme']['schema:funder'] as Dict[] as Funder[]
                                                        }}
                                                    />
                                                </Col>
                                            }
                                            {/* Show multimedia block, if multimedia is present */}
                                            {taxonomicService.taxonomicService['schema:associatedMedia'] &&
                                                <Col xs={{ span: 12 }} lg
                                                    className="mt-4 mt-lg-0 mb-lg-3"
                                                >
                                                    <MultimediaBlock multimediaItems={taxonomicService.taxonomicService['schema:associatedMedia']} />
                                                </Col>
                                            }
                                        </Row>
                                    </Col>
                                </Row>
                            </>
                        }
                        {/* If an error occurred */}
                        {errorMessage &&
                            <Row className="h-100">
                                <Col className="d-flex flex-column justify-content-center align-items-center">
                                    <Row>
                                        <Col>
                                            <p>{`An error occurred whilst searching for Taxonomic Service with ID: ${taxonomicServiceID}`}</p>
                                        </Col>
                                    </Row>
                                    <Row className="mt-2">
                                        <Col>
                                            <p>{errorMessage}</p>
                                        </Col>
                                    </Row>
                                    <Row className="mt-2">
                                        <Col>
                                            <p>
                                                Retry or go back to <Link to="/"
                                                    className="tc-primary"
                                                >
                                                    home
                                                </Link></p>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        }
                    </Col>
                </Row>
            </Container >

            {/* Render Footer */}
            < Footer />
        </div >
    );
}

export default TaxonomicService;