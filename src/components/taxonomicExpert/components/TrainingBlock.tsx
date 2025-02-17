/* Import Dependencies */
import { Row, Col } from 'react-bootstrap';

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
                            {trainingCard()}
                            {trainingCard()}
                            {trainingCard()}
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default TrainingBlock;

function trainingCard() {
    return <div className="card mb-3">
        <div className="card-body">
            <h5 className="card-title">Card Title</h5>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        </div>
        <div className="card-footer">
            <a href="#" className="btn btn-primary">Go somewhere</a>
        </div>
    </div>;
}
