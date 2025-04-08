/* Import Dependencies */
import { useState } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';

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
const TrainingBlock = (props: Props) => {
    const { name, taxonomicExpert } = props;
    const training = taxonomicExpert.taxonomicExpert['schema:educationAndTrainingProvision'];
    return (
        <div className="h-100 d-flex flex-column mb-3">
            {/* Name of block */}
            <Row>
                <Col className="col-md-auto">
                    <div className="bgc-tertiary px-4 py-1">
                        <p className="fw-lightBold">{name}</p>
                    </div>
                </Col>
            </Row>
            {/* Properties content */}
            <Row className="h-100">
                <Col>
                    <div className="h-100 b-tertiary px-4 py-3 overflow-auto" style={{ maxHeight: '250px', overflowY: 'scroll' }}>
                        <div style={{ maxHeight: '100%', overflowY: 'auto' }}>
                            {training && (() => {
                                const cards = [];
                                for (const item of training) {
                                    cards.push(<TrainingCard data={item} />);
                                }
                                return cards;
                            })()}
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default TrainingBlock;


function TrainingCard({ data }: { readonly data: any }) {
    console.log(data);
    const [expanded, setExpanded] = useState(false);

    const toggleText = () => {
        setExpanded(!expanded);
    };

    const name = data['schema:name'] as string || 'Any name provided';
    const text = data['schema:description'] as string || 'Any description provided';
    const MAX_TEXT_LENGTH = 300;
    const croppedText = text.length > MAX_TEXT_LENGTH ? text.substring(0, MAX_TEXT_LENGTH) + '...' : text;
    const url = data['schema:contentUrl'] as string || undefined;
    const availableThrough = data['schema:EducationalOccupationalProgram'] as string || undefined;

    return (
        <Card className="mb-3 custom-card">
            <Card.Body>
                <Card.Title className='fs-3 fw-bold'>{name}</Card.Title>
                <Card.Text>
                    {expanded
                        ? text
                        : croppedText
                    }
                    {text.length > MAX_TEXT_LENGTH && (
                        <Button variant="link" onClick={toggleText}>
                            {expanded ? "Read Less" : "Read More"}
                        </Button>
                    )}
                </Card.Text>
                <div className="fs-4 fw-bold d-flex justify-content-between m-3">
                    <Card.Link href={url} className="d-flex align-items-center">
                        <i className="bi bi-link-45deg me-2"></i> URL
                    </Card.Link>
                    <Card.Link href={availableThrough} className="d-flex align-items-center">
                        <i className="bi bi-link-45deg me-2"></i> Avaible though DEST
                    </Card.Link>
                </div>
            </Card.Body>
        </Card>
    );
}
