/* Import Dependencies */
import { Row, Col } from 'react-bootstrap';
import { Chart } from "react-google-charts";

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
const ExperienceBlock = (props: Props) => {
    const { name, taxonomicExpert } = props;

    const educationLevel = taxonomicExpert?.taxonomicExpert?.['schema:occupation']?.['schema:educationalLevel'] || ['Any education level provided'];
    const employmentType = taxonomicExpert?.taxonomicExpert?.['schema:occupation']?.['schema:employmentType'] || ['Any employment status provided'];
    const yearsOfExperience = taxonomicExpert?.taxonomicExpert?.['schema:occupation']?.['schema:yearsInOperation'] as string || 'Any years of experience provided';
    
    let bar = ["", 0, 0, 0, 0, 0, 0, 0]

    const experienceRanges = [
        "0 - 5 years",
        "6 - 10 years",
        "11 - 15 years",
        "16 - 20 years",
        "21 - 25 years",
        "26 - 30 years",
        ">30 years"
    ]

    const index = experienceRanges.indexOf(yearsOfExperience)

    if (index !== -1) {
        bar = ["", ...Array(7).fill(0).map((_, i) => i <= index ? 1 : 0)]
    }

    const data = [
        ["Years", "0-5", "6-10", "11-15", "16-20", "21-25", "26-30", ">30"],
        bar,
    ];
      
    const options = {
        width: 400,
        height: 100,
        chartArea: { width: "80%", height: "20%" },
        bar: { groupWidth: "100%"},
        backgroundColor: "transparent",
        legend: { position: "none" },
        isStacked: true,
        hAxis: {
            title: "Yrs",
            textStyle: { fontSize: 10 },
            ticks: [0, 1, 2, 3, 4, 5, 6], // Numeric positions for the ticks
            format: '0', // Ensure numeric format
            gridlines: { count: 7 },
        },
        series: {
            0: { color: "#3498db" }, // Filled sections (blue)
            1: { color: "#3498db" },
            2: { color: "#3498db" },
            3: { color: "#3498db" },
            4: { color: "#3498db" },
            5: { color: "#3498db" },
            6: { color: "#3498db" },
        },
    };
    
    const customTicks = [
        { v: 0, f: "0-5" },
        { v: 1, f: "6-10" },
        { v: 2, f: "11-15" },
        { v: 3, f: "16-20" },
        { v: 4, f: "21-25" },
        { v: 5, f: "26-30" },
        { v: 6, f: ">30" },
    ];
    
    // Apply the custom ticks to the hAxis (assuming you're using a Google Charts component)
    // @ts-ignore
    options.hAxis.ticks = customTicks;
      

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
                        <Row className="d-flex align-items-center mb-3">
                            <Col lg='4' className="d-flex align-items-center">
                                <p className='fw-bold'>Education level</p>
                            </Col>
                            <Col lg='8' className="d-flex align-items-center justify-content-center">
                                <Row className="text-end">
                                    {educationLevel.map((level) => (
                                        <p key={level}>{level}</p>
                                    ))}
                                </Row>
                            </Col>
                        </Row>
                        <Row className="d-flex align-items-center">
                            <Col lg='4' className='d-flex align-items-center'>
                                <p className='fw-bold'>Employment status</p>
                            </Col>
                            <Col lg='8' className='d-flex align-items-center justify-content-center'>
                                <Row className="text-end">
                                    {employmentType.map((employment) => (
                                        <p key={employment}>{employment}</p>
                                    ))}
                                </Row>
                            </Col>
                        </Row>
                        <Row className="d-flex align-items-center">
                            <Col className="d-flex align-items-center">
                                <p className='fw-bold'>Years of experience</p>
                            </Col>
                            <Col lg='auto' className="d-flex align-items-center overflow-hidden">
                                <Chart
                                    chartType="BarChart"
                                    width="100%"
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