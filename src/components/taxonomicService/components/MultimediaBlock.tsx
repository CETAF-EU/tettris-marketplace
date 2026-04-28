/* Import Dependencies */
import { Row, Col } from 'react-bootstrap';

/* Import Styles */
import styles from 'components/taxonomicService/taxonomicService.module.scss';


/* Props Type */
type Props = {
    multimediaItems: {
        "schema:contentUrl": string
    }[]
};


const MultimediaBlock = (props: Props) => {
    const { multimediaItems } = props;

    return (
        <div className="h-100 d-flex flex-column">
            {/* Name of block */}
            <Row>
                <Col className="col-md-auto">
                    <div className="bgc-primary px-4 py-1">
                        <p className="fw-lightBold">Multimedia</p>
                    </div>
                </Col>
            </Row>
            {/* Multimedia items */}
            <Row className="flex-grow-1">
                <Col>
                    <div className="h-100 b-primary px-4 py-3">
                        <Row className="justify-content-between">
                            {multimediaItems.map(multimediaItem => (
                                <Col key={multimediaItem['schema:contentUrl']}
                                    lg={{ span: 4 }}
                                    className="mb-3"
                                >
                                    <div className={`${styles.imageBackground} h-100 w-100 d-flex justify-content-center`}>
                                        {(multimediaItem['schema:contentUrl'].startsWith('https://www.youtube.com/watch?v=')|
                                        multimediaItem['schema:contentUrl'].startsWith('https://youtu.be/')) ? (
                                            <iframe 
											src="https://www.youtube-nocookie.com/embed/{multimediaItem['schema:contentUrl'].replace(/(?:https?:\/\/)?(?:www\.)?youtu(?:(\.be\/|be.com\/.*?v=))/, '')}" 
											title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""
                                            className={`${styles.multimediaItem} object-fit-contain`}>
											</iframe>
                                        ):(
                                            <img src={multimediaItem['schema:contentUrl']}
                                                alt={multimediaItem['schema:contentUrl']}
                                                className={`${styles.multimediaItem} object-fit-contain`}
                                            />
                                        )}
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default MultimediaBlock;
