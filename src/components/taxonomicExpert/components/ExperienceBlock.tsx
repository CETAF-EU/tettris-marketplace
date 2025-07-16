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
        "> 30 years"
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
        chartArea: { width: "95%", height: "30%" },
        bar: { groupWidth: "100%"},
        backgroundColor: "transparent",
        legend: { position: "none" },
        isStacked: true,
        enableInteractivity: false,
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
        { v: 0, f: "~ 0" },
        { v: 1, f: "~ 5" },
        { v: 2, f: "~ 10" },
        { v: 3, f: "~ 15" },
        { v: 4, f: "~ 20" },
        { v: 5, f: "~ 25" },
        { v: 6, f: "> 30" },
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
                        {/* Education level */}
                        <Row className="align-items-center mb-3">
                            <Col lg={4}>
                                <p className="fw-bold mb-0">Education level</p>
                            </Col>
                            <Col lg={8} className="text-center">
                                {educationLevel.map((level) => (
                                    <p className="mb-0" key={level}>{level}</p>
                                ))}
                            </Col>
                        </Row>

                        {/* Employment status */}
                        <Row className="align-items-center mb-3">
                            <Col lg={4}>
                                <p className="fw-bold mb-0">Employment status</p>
                            </Col>
                            <Col lg={8} className="text-center">
                                {employmentType.map((employment) => (
                                    <p className="mb-0" key={employment}>{employment}</p>
                                ))}
                            </Col>
                        </Row>

                        {/* Years of experience */}
                        <Row className="align-items-center">
                            <Col lg={4}>
                                <p className="fw-bold mb-0">Years of experience</p>
                            </Col>
                            <Col lg={8} className="d-flex justify-content-center">
                                <div className="w-100" style={{ maxWidth: '25rem' }}>
                                    <Chart
                                        chartType="BarChart"
                                        data={data}
                                        options={options}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ExperienceBlock;