/* Import Dependencies */
import classNames from 'classnames';
import { Field } from "formik";
import { Row, Col } from 'react-bootstrap';

/* Import Types */
import { FormField } from "app/Types";
import { Color, getColor } from 'components/general/ColorPage';


/* Props Type */
type Props = {
    field: FormField
};


/**
 * Component that renders an input field for a free text insert
 * @param field The provided form field
 * @returns JSX Component
 */
const BooleanField = (props: Props) => {
    const { field } = props;

    /* Class Names */
    /* Determine color */
    const color: Color = getColor(window.location) as Color;

    const formFieldClass = classNames({
        [color]: field.required
    });

    return (
        <div>
            <Row>
                <Col xs="auto" lg="auto"
                    className="pe-0"
                >
                    <p>
                        {field.title}
                    </p>
                </Col>
                <Col>
                    <Field name={field.jsonPath.replace('$', '')}
                        type="checkbox"
                        className={`${formFieldClass} mt-1 py-1 px-2 br-corner`}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <p className="fs-5 tc-grey">
                        {field.description}
                    </p>
                </Col>
            </Row>
        </div>
    );
};

export default BooleanField;