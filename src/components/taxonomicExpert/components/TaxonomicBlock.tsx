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

    const discipline = taxonomicExpert.taxonomicExpert?.['schema:Taxon']?.['schema:discipline']?.join(', ') ?? "N/A";
    const subDiscipline = taxonomicExpert.taxonomicExpert?.['schema:Taxon']?.['schema:additionalType']?.join(', ') ?? "N/A";
    const taxonomicScope = taxonomicExpert.taxonomicExpert?.['schema:Taxon']?.['schema:about'] ?? "N/A";
    const geographicRegion = taxonomicExpert.taxonomicExpert?.['schema:Taxon']?.['schema:spatialCoverage'] ?? [];
    const methodologies = taxonomicExpert.taxonomicExpert?.['schema:Taxon']?.['schema:measurementTechnique']?.join(', ') ?? "N/A";
    const appliedResearch = taxonomicExpert.taxonomicExpert?.['schema:Taxon']?.['schema:ResearchProject']?.join(', ') ?? "N/A";
    const stratigraphicAge = taxonomicExpert.taxonomicExpert?.['schema:Taxon']?.['schema:temporalCoverage'] ?? "N/A";

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
                    <div className="h-100 b-tertiary px-4 py-3">
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
    const data = [
        ["Type", "Number"],
        ["Identification Keys", taxonomicExpert.taxonomicExpert?.['schema:PublicationNumber']?.['schema:identifier'] ?? 0],
        ["Papers", taxonomicExpert.taxonomicExpert?.['schema:PublicationNumber']?.['schema:ScholarlyArticle'] ?? 0],
        ["Books", taxonomicExpert.taxonomicExpert?.['schema:PublicationNumber']?.['schema:Book'] ?? 0],
        ["Other", taxonomicExpert.taxonomicExpert?.['schema:PublicationNumber']?.['schema:CreativeWork'] ?? 0],
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

function displayGeographicContent(geographicRegion: Array<string>) {
    return <Row>
        <Col>
            <p className='fw-bold'>Geographic region</p>
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
