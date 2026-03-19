/* Import Dependencies */
import { Row, Col } from 'react-bootstrap';
import { Chart } from "react-google-charts";
import WorldMap from './WorldMap';

/* Import Types */
import { TaxonomicExpert } from 'app/Types';

/* Props Type */
type Props = {
    name: string
    taxonomicExpert: TaxonomicExpert
};


/**
 * Component that renders a details block for on the taxonomic service page
 * @param properties An object containing all the properties to be show in the details block
 * @returns JSX Component
 */
const TaxonomicBlock = (props: Props) => {
    const { name, taxonomicExpert } = props;
    const expertRecord = (taxonomicExpert.taxonomicExpert ?? taxonomicExpert) as Record<string, unknown>;

    const taxon = expertRecord?.['schema:Taxon'] as Record<string, unknown> | undefined;
    const discipline = (taxon?.['schema:discipline'] as string[] | undefined)?.join(', ') ?? "N/A";
    const subDiscipline = (taxon?.['schema:additionalType'] as string[] | undefined)?.join(', ') ?? "N/A";
    const taxonomicScope = (taxon?.['schema:about'] as string | undefined) ?? "N/A";
    const geographicRegion = (taxon?.['schema:spatialCoverage'] as string[] | undefined) ?? [];
    const methodologies = (taxon?.['schema:measurementTechnique'] as string[] | undefined)?.join(', ') ?? "N/A";
    const appliedResearch = (taxon?.['schema:ResearchProject'] as string[] | undefined)?.join(', ') ?? "N/A";
    const stratigraphicAge = (taxon?.['schema:temporalCoverage'] as string | undefined) ?? "N/A";

    return (
        <div className=" d-flex flex-column">
            {/* Name of block */}
            <Row>
                <Col className="col-md-auto">
                    <div className="bgc-tertiary px-4 py-1">
                        <p className="fw-lightBold">{name}</p>
                    </div>
                </Col>
            </Row>
            {/* Properties content */}
            <Row className="flex-grow-1">
                <Col>
                    <div className="h-100 b-tertiary px-4 py-3 overflow-hidden">
                        {DisplayRowData("Discipline", discipline)}
                        {DisplayRowData("Sub discipline", subDiscipline)}
                        {DisplayRowData("Taxonomic Scope", taxonomicScope)}
                        {displayGeographicContent(geographicRegion)}
                        {DisplayRowData("Methodologies", methodologies)}
                        {DisplayRowData("Applied Research", appliedResearch)}
                        {displayPublicationChart(taxonomicExpert)}
                        {DisplayRowData("Stratigraphic age", stratigraphicAge)}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default TaxonomicBlock;

function displayPublicationChart(taxonomicExpert: TaxonomicExpert) {
    const expertRecord = (taxonomicExpert.taxonomicExpert ?? taxonomicExpert) as Record<string, unknown>;
    const publicationNumber = (
        expertRecord?.['schema:publicationNumber']
        ?? expertRecord?.['publicationNumber']
    ) as Record<string, unknown> | undefined;
    const identificationKeys = getPublicationValue(publicationNumber, 'schema:identifier', 'identifier');
    const papers = getPublicationValue(publicationNumber, 'schema:scholarlyArticle', 'scholarlyArticle');
    const books = getPublicationValue(publicationNumber, 'schema:book', 'book');
    const other = getPublicationValue(publicationNumber, 'schema:creativeWork', 'creativeWork');

    const data = [
        ["Type", "Number"],
        ["Identification Keys", identificationKeys],
        ["Papers", papers],
        ["Books", books],
        ["Other", other],
    ];
    const options = {
        width: 400,
        height: 100,
        chartArea: { width: "100%", height: "100%" },
        bar: { groupWidth: "100%"},
        backgroundColor: "transparent",
        pieHole: 0.6,
        pieSliceText: 'none',
        colors: ['#7BC1DC', '#5DA9C7', '#3F91B2', '#21799D'],
    };
    if (identificationKeys === 0 && papers === 0 && books === 0 && other === 0) {
        return DisplayRowData("Publication Number", "N/A");
    }
    return <Row>
        <Col>
            <p className='fw-bold'>Publication Number</p>
        </Col>
        <Col xs='auto' style={{ minWidth: '30rem', textAlign: 'center' }}>
            <Chart
                chartType="PieChart"
                width="100%"
                height="150px"
                data={data}
                options={options} />
        </Col>
    </Row>;
}

function getPublicationValue(
    publicationNumber: Record<string, unknown> | undefined,
    schemaKey: string,
    fallbackKey: string,
): number {
    if (!publicationNumber) {
        return 0;
    }

    let normalizedPublicationNumber: Record<string, unknown> | undefined = publicationNumber;

    if (Array.isArray(publicationNumber)) {
        const firstItem = publicationNumber[0];
        if (firstItem && typeof firstItem === 'object') {
            normalizedPublicationNumber = firstItem as Record<string, unknown>;
        }
    }

    if (!normalizedPublicationNumber) {
        return 0;
    }

    const nestedPublicationNumber = (
        normalizedPublicationNumber['schema:publicationNumber']
        ?? normalizedPublicationNumber['publicationNumber']
    ) as Record<string, unknown> | undefined;

    const source = nestedPublicationNumber && typeof nestedPublicationNumber === 'object'
        ? nestedPublicationNumber
        : normalizedPublicationNumber;

    const rawValue = source[schemaKey]
        ?? source[fallbackKey]
        ?? normalizedPublicationNumber[schemaKey]
        ?? normalizedPublicationNumber[fallbackKey];

    if (typeof rawValue === 'number') {
        return Number.isFinite(rawValue) ? rawValue : 0;
    }

    if (typeof rawValue === 'string') {
        const parsed = Number(rawValue);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    return 0;
}

function displayGeographicContent(geographicRegion: Array<string>) {
    return <Row>
        <Col lg='3'>
            <p className='fw-bold'>Geographic region</p>
        </Col>
       <Col lg="3">
            {geographicRegion.length > 0 ? (
                <p>
                {geographicRegion.map((region) => (
                    <span key={region}>
                    {region}
                    <br />
                    </span>
                ))}
                </p>
            ) : (
                <p>N/A</p>
            )}
        </Col>
        <Col>
            <WorldMap region={geographicRegion} />
        </Col>
    </Row>;
}

function DisplayRowData(title: string, data: string) {
    return  <Row className="d-flex align-items-center mb-3">
        <Col className="d-flex align-items-center">
            <p className='fw-bold mb-0'>{title}</p>
        </Col>
        <Col xs='9' className="d-flex align-items-center">
            <p className='mb-0'>{data}</p>                       
        </Col>
    </Row>
}
