/* Import Dependencies */
import { Row, Col } from 'react-bootstrap';
import { Chart } from "react-google-charts";

/* Props Type */
type Props = {
    name: string,
};


/**
 * Component that renders a details block for on the taxonomic service page
 * @param properties An object containing all the properties to be show in the details block
 * @returns JSX Component
 */
const ExperienceBlock = (props: Props) => {
    const { name } = props;


    const data = [
        [
          "Element",
          "Years of experience",
          { role: "style" },
          {
            role: "annotation",
            type: "string",
          },
        ],
        ["", 10, "#7BC1DC", ""],
    ];
      
    const options = {
        width: 400,
        height: 80,
        bar: { groupWidth: "70%" },
        legend: { position: "none" },
        backgroundColor: 'transparent',
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
                        <Row>
                            <Col>
                                <p>Education level - PhD</p>
                            </Col>
                            <Col>
                                <p>Employment status - Full Time scientist</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <p>Years of experience</p>
                            </Col>
                            <Col>
                                <Chart
                                    chartType="BarChart"
                                    width="100%"
                                    height="100px"
                                    data={data}
                                    options={options}
                                    />                          
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ExperienceBlock;