/* Import Dependencies */
import { Col, Container, Row } from 'react-bootstrap';

/* Import Components */
import Header from 'components/general/header/Header';
import Footer from 'components/general/footer/Footer';
import { pollinatorCollections } from './pollinatorCollectionsData';

const PollinatorCollections = () => {
    return (
        <div className="h-100 d-flex flex-column">
            <Header />

            <Container fluid className="flex-grow-1 overflow-auto">
                <Row className="h-100">
                    <Col lg={{ span: 10, offset: 1 }} className="h-100 d-flex flex-column pt-3 pt-lg-5 px-4 px-lg-3">
                        <Row className="mb-4">
                            <Col lg={{ span: 12 }} className="p-4 bg-light rounded shadow-sm">
                                <h2 className="fw-bold mb-3">Pollinator Collections Data and Survey Model</h2>
                                <p>
                                    This page provides links to pollinator-related collection descriptors published in
                                    GrSciColl as part of TETTRIS activities. It also includes the EuSurvey questionnaire
                                    model file that was used to collect these descriptors and can be reused by registered
                                    EuSurvey users for future data collection.
                                </p>

                                <h3 className="fw-bold mt-4 mb-3">Downloads</h3>
                                <ul className="mb-4">
                                    <li>
                                        <a
                                            href="/documents/SURVEY TEMPLATE.eus"
                                            download
                                            className="tc-tertiary"
                                        >
                                            EuSurvey questionnaire model (.eus)
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/documents/WP1.2 TETTRIS descriptor lists.xlsx"
                                            download
                                            className="tc-tertiary"
                                        >
                                            TETTRIS descriptor list (.xlsx)
                                        </a>
                                    </li>
                                </ul>

                                <h3 className="fw-bold mt-4 mb-3">Collections in GrSciColl</h3>
                                <div className="table-responsive">
                                    <table className="table table-striped table-bordered align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Institution</th>
                                                <th>Data coverage</th>
                                                <th>GRSciColl links</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pollinatorCollections.map((collection) => (
                                                <tr key={collection.institution}>
                                                    <td>
                                                        <p className="mb-1 fw-bold">{collection.institution}</p>
                                                        {collection.project && (
                                                            <p className="mb-0 text-muted">{collection.project}</p>
                                                        )}
                                                    </td>
                                                    <td>{collection.dataCoverage}</td>
                                                    <td>
                                                        <ul className="mb-0 ps-3">
                                                            {collection.links.map((link) => (
                                                                <li key={link.url}>
                                                                    <a
                                                                        href={link.url}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="tc-tertiary"
                                                                    >
                                                                        {link.label}
                                                                    </a>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>

            <Footer />
        </div>
    );
};

export default PollinatorCollections;
