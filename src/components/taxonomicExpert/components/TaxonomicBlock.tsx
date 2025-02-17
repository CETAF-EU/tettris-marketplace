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

    const data = [
        ["Type", "Number"],
        ["Identification Keys", 11],
        ["Papers", 2],
        ["Books", 2],
        ["Other", 2],
      ];
      
    const options = {
        pieHole: 0.4,
        is3D: false,
      };

    return (
        <div className="h-100 d-flex flex-column">
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
                        <Row>
                            <Col>
                                <p>Geographic region</p>
                            </Col>
                            <Col>
                                <WorldMap />
                            </Col>
                        </Row>
                        {DisplayRowData("Methodologies", "Morphological")}
                        {DisplayRowData("Applied Research", "Anatomy, biomechanics")}
                        <Row>
                            <Col>
                                <p>Publication Number</p>
                            </Col>
                            <Col>
                                <Chart
                                    chartType="PieChart"
                                    width="100%"
                                    height="150px"
                                    data={data}
                                    options={{ ...options, backgroundColor: 'transparent' }}
                                />
                            </Col>
                        </Row>
                        {DisplayRowData("Stratigraphic age", "Present")}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default TaxonomicBlock;

function DisplayRowData(title: string, data: string) {
    return <Row className='mb-3 mt-3'>
        <p>{title} - {data}</p>
    </Row>;
}
