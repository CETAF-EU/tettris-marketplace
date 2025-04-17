/* Import Dependencies */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from 'classnames';
import { FieldArray, Field } from "formik";
import jp from 'jsonpath';
import { isEmpty } from "lodash";
import { Row, Col } from 'react-bootstrap';

/* Import Types */
import { FormField, Dict } from "app/Types";

/* Import Icons */
import { faX } from "@fortawesome/free-solid-svg-icons";

/* Import Components */
import { Button } from "components/general/CustomComponents";
import { Color, getColor } from "components/general/ColorPage";


/* Props Type */
type Props = {
    field: FormField,
    fieldValues: string[],
    values: Dict
};


/**
 * Component that returns a section of an array with string fields in the form
 * @param field The provided form field
 * @param fieldValues The current values of the field in the form state
 * @param values The current values in the form state
 * @returns JSX Component
 */
const StringArrayField = (props: Props) => {
    const { field, fieldValues, values } = props;

    /* Base variables */
    const jsonPath = field.jsonPath.replace('$', '');
    /* Determine color */
    const color: Color = 'tc-' + getColor(window.location) as Color;
    /* Class Names */
    const formFieldClass = classNames({
        'b-error': (field.required && !jp.value(values, field.jsonPath)?.find((value: string) => !!value))
    });

    return (
        <div>
            <FieldArray name={field.jsonPath.replace('$', '')}>
                {({ push, remove }) => (
                    <div>
                        <Row>
                            <Col>
                                <Row>
                                    <Col lg="auto"
                                        className="pe-0"
                                    >
                                        <p>
                                            {field.title}
                                        </p>
                                    </Col>
                                    {(field.required && !isEmpty(values) && !jp.value(values, field.jsonPath)?.find((value: string) => !!value)) &&
                                        <Col className="d-flex align-items-center">
                                            <p className="fs-4 tc-error">
                                                This field is required
                                            </p>
                                        </Col>
                                    }
                                    <Col lg={{ span: 12 }}>
                                        <p className="fs-5 tc-grey">
                                            {field.description}
                                        </p>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        {fieldValues.map((_fieldValue, index) => {
                            const key = `${jsonPath}-${index}`;

                            return (
                                <Row key={key}
                                    className="mt-2"
                                >
                                    <Col className="ps-4">
                                        <Field name={`${jsonPath}[${index}]`}
                                            className={`${formFieldClass} w-100 py-1 px-2 br-corner`}
                                        />
                                    </Col>
                                    {fieldValues.length > 1 &&
                                        <Col xs="auto" lg="auto"
                                            className="d-flex align-items-center"
                                        >
                                            <Button type="button"
                                                variant="blank"
                                                className="px-0 py-0"
                                                OnClick={() => remove(index)}
                                            >
                                                <FontAwesomeIcon icon={faX}
                                                    className="tc-grey"
                                                    size="lg"
                                                />
                                            </Button>
                                        </Col>
                                    }
                                </Row>
                            );
                        })}
                        <Row className="mt-1">
                            <Col>
                                <Button type="button"
                                    variant="blank"
                                    className="px-0 py-0"
                                    OnClick={() => push('')}
                                >
                                    <p className={color}>
                                        Add value
                                    </p>
                                </Button>
                            </Col>
                        </Row>
                    </div>
                )}
            </FieldArray>
        </div>
    );
};

export default StringArrayField;