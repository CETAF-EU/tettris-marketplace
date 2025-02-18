/* Import Dependencies */
import { Row, Col } from 'react-bootstrap';
import { Chart } from "react-google-charts";
import WorldMap from './WorldMap';

/* Props Type */
type Props = {
    name: string,
};


/**
 * Component that renders a details block for on the taxonomic service page
 * @param properties An object containing all the properties to be show in the details block
 * @returns JSX Component
 */
const TaxonomicBlock = (props: Props) => {
    const { name } = props;

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
                        {DisplayRowData("Discipline", "Biology")}
                        {DisplayRowData("Sub discipline", "Insects")}
                        {DisplayRowData("Taxonomic Scope", "Bees")}
                        {displayGeographicContent()}
                        {DisplayRowData("Methodologies", "Morphological")}
                        {DisplayRowData("Applied Research", "Anatomy, biomechanics")}
                        {displayPublicationChart()}
                        {DisplayRowData("Stratigraphic age", "Present")}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default TaxonomicBlock;

function displayPublicationChart() {
    const data = [
        ["Type", "Number"],
        ["Identification Keys", 11],
        ["Papers", 2],
        ["Books", 2],
        ["Other", 2],
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
        <Col xs='8'>
            <Chart
                chartType="PieChart"
                width="100%"
                height="150px"
                data={data}
                options={options} />
        </Col>
    </Row>;
}

function displayGeographicContent() {
    return <Row>
        <Col>
            <p className='fw-bold'>Geographic region</p>
        </Col>
        <Col>
            <WorldMap />
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
