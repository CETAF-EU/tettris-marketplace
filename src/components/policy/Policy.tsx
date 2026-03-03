import { Col, Container, Row } from 'react-bootstrap';

import Header from 'components/general/header/Header';
import Footer from 'components/general/footer/Footer';

const Policy = () => {
    return (
        <div className="h-100 d-flex flex-column">
            <Header />
            <Container fluid className="flex-grow-1 overflow-auto">
                <Row className="h-100">
                    <Col lg={{ span: 10, offset: 1 }} className="h-100 d-flex flex-column pt-3 pt-lg-5 px-4 px-lg-3">
                        <Row className="mt-5 mb-4">
                            <Col lg={{ span: 10, offset: 1 }} className="p-4 bg-light rounded shadow-sm">
                                <h2 className="fw-bold mb-3">Privacy and data use notice</h2>
                                <p>
                                    The CETAF Taxonomic e-Services and Expertise Marketplace supports discovery, visibility,
                                    and contact with taxonomic experts and services. Personal and professional data are
                                    collected and processed solely for this purpose.
                                </p>

                                <h3 className="fw-bold mt-4 mb-2">Who operates the Marketplace</h3>
                                <p>
                                    The Taxonomic e-Service and Expertise Marketplace is operated by CETAF (Consortium of
                                    European Taxonomic Facilities). CETAF acts as the data controller for the Marketplace
                                    within the meaning of the General Data Protection Regulation (GDPR).
                                </p>

                                <h3 className="fw-bold mt-4 mb-2">What data are collected</h3>
                                <p>The Marketplace collects professional information provided directly by users, including:</p>
                                <ul className="mb-3">
                                    <li>Name and affiliation.</li>
                                    <li>Areas of taxonomic expertise.</li>
                                    <li>Geographic and thematic scope.</li>
                                    <li>Professional experience and training activities.</li>
                                    <li>Contact details (email, not publicly displayed).</li>
                                </ul>
                                <p>No sensitive personal data is required.</p>

                                <h3 className="fw-bold mt-4 mb-2">Minors</h3>
                                <p>
                                    The CETAF Taxonomic e-Services and Expertise Marketplace is intended for individuals aged 18
                                    years or older. CETAF does not knowingly collect or publish personal data relating to minors.
                                </p>
                                <p>
                                    If CETAF becomes aware that a profile has been created by an individual under the age of 18,
                                    the profile will be promptly unpublished and the associated personal data will be deleted
                                    without undue delay, unless retention is required for legal or administrative reasons.
                                </p>

                                <h3 className="fw-bold mt-4 mb-2">Purpose of data collection</h3>
                                <p>Data are collected to:</p>
                                <ul className="mb-3">
                                    <li>Enable discovery of taxonomic expertise and services.</li>
                                    <li>Facilitate contact between experts and users.</li>
                                    <li>Improve visibility and recognition of taxonomic capacity in Europe.</li>
                                    <li>Support aggregated, non-identifying statistics about taxonomic capacity.</li>
                                </ul>

                                <h3 className="fw-bold mt-4 mb-2">Legal basis</h3>
                                <p>
                                    All personal data are processed on the basis of explicit user consent, in accordance with
                                    the General Data Protection Regulation (GDPR).
                                </p>

                                <h3 className="fw-bold mt-4 mb-2">Visibility and access</h3>
                                <ul className="mb-3">
                                    <li>Expert profiles are publicly visible once verified.</li>
                                    <li>Contact is enabled via a protected contact mechanism.</li>
                                    <li>CETAF may provide access to non-personal, aggregated metadata for analytical or reporting purposes.</li>
                                </ul>

                                <h3 className="fw-bold mt-4 mb-2">Data ownership</h3>
                                <ul className="mb-3">
                                    <li>Experts retain ownership of the information they provide.</li>
                                    <li>CETAF acts as the custodian of the Marketplace database and is responsible for its operation and maintenance.</li>
                                    <li>CETAF does not acquire ownership rights beyond what is necessary to display and manage the data within the platform.</li>
                                </ul>

                                <h3 className="fw-bold mt-4 mb-2">Data sources and traceability</h3>
                                <p>
                                    Where data are imported or suggested from external platforms (e.g. ORCID or other open
                                    infrastructures), this will be clearly indicated, and users remain responsible for validating
                                    the information before publication.
                                </p>

                                <h3 className="fw-bold mt-4 mb-2">Data storage and protection</h3>
                                <p>
                                    Data are stored on CETAF-managed infrastructure. The public website is served via a
                                    dedicated web frontend, while data storage is handled by a separate backend service.
                                    External access is routed through a reverse proxy, and traffic is encrypted in transit
                                    using HTTPS with certificates managed via Let's Encrypt.
                                </p>

                                <h3 className="fw-bold mt-4 mb-2">Updates, correction and deletion</h3>
                                <p>
                                    Users can update their profiles and request deletion of their profile at any time by logging
                                    on the registration form.
                                </p>
                                <p>
                                    To ensure data quality, CETAF may periodically contact profile holders (e.g. every year) to
                                    confirm whether their information remains valid and to update if necessary.
                                </p>

                                <h3 className="fw-bold mt-4 mb-2">Data retention</h3>
                                <p>
                                    Where profile information can no longer be verified and no response is received over an
                                    extended period (e.g. two years), the profile may be unpublished or removed in accordance
                                    with the GDPR principle of storage limitation. Where possible, unpublished profiles may be
                                    restored upon request.
                                </p>

                                <h3 className="fw-bold mt-4 mb-2">Third party links disclaimer</h3>
                                <p>
                                    Links to external platforms or websites are provided for convenience only. CETAF does not
                                    control or take responsibility for the content, accessibility or practices of third-party
                                    websites.
                                </p>

                                <h3 className="fw-bold mt-4 mb-2">Contact</h3>
                                <p className="mb-0">
                                    For any data-related request, users can contact CETAF via the{" "}
                                    <a className="tc-tertiary" href="/support">Marketplace contact page</a>.
                                </p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
};

export default Policy;
