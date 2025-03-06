/* Import Dependencies */
import { useState } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';

/* Props Type */
type Props = {
    name: string,
};


/**
 * Component that renders a details block for on the taxonomic service page
 * @param properties An object containing all the properties to be show in the details block
 * @returns JSX Component
 */
const TrainingBlock = (props: Props) => {
    const { name } = props;

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
                            {TrainingCard()}
                            {TrainingCard()}
                            {TrainingCard()}
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default TrainingBlock;


function TrainingCard() {
    const [expanded, setExpanded] = useState(false);

    const toggleText = () => {
        setExpanded(!expanded);
    };

    return (
        <Card className="mb-3 custom-card">
            <Card.Body>
                <Card.Title className='fs-3 fw-bold'>Card Title</Card.Title>
                <Card.Text>
                    {expanded
                        ? "Some quick example text to build on the card title and make up the bulk of the card's content, and even more content to show how the expansion works!"
                        : "Some quick example text to build on the card title and make up the bulk of the card's content."
                    }
                    <Button variant="link" onClick={toggleText}>
                        {expanded ? "Read Less" : "Read More"}
                    </Button>
                </Card.Text>
                <div className="fs-4 fw-bold d-flex justify-content-between m-3">
                    <Card.Link href="#" className="d-flex align-items-center">
                        <i className="bi bi-link-45deg me-2"></i> URL
                    </Card.Link>
                    <Card.Link href="#" className="d-flex align-items-center">
                        <i className="bi bi-link-45deg me-2"></i> Avaible though DEST
                    </Card.Link>
                </div>
            </Card.Body>
        </Card>
    );
}
