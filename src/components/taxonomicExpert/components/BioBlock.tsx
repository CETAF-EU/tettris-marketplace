/* Import Dependencies */
import { Row, Col } from 'react-bootstrap';

/* Props Type */
type Props = {
    name: string,
    text: string,
};


/**
 * Component that renders a details block for on the taxonomic service page
 * @param properties An object containing all the properties to be show in the details block
 * @returns JSX Component
 */
const BioBlock = (props: Props) => {
    const { name, text } = props;

    const MAX_TEXT_LENGTH = 300;
    const croppedText = text.length > MAX_TEXT_LENGTH ? text.substring(0, MAX_TEXT_LENGTH) + '...' : text;
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
                        <p className='fs-4 m-1'>{croppedText}</p>
                        {text.length > MAX_TEXT_LENGTH && (
                            <div className="d-flex justify-content-end">
                                <button className="btn btn-link p-0" onClick={() => alert(text)}>Read More</button>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default BioBlock;