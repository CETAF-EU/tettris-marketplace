/* Import Dependencies */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FieldArray } from "formik";
import jp from 'jsonpath';
import { cloneDeep } from "lodash";
import { Row, Col } from "react-bootstrap";

/* Import Utilities */
import { MakeReadableString } from "app/Utilities";

/* Import Types */
import { FormField, Dict } from "app/Types";

/* Import Icons */
import { faX } from "@fortawesome/free-solid-svg-icons";

/* Import Components */
import { Button } from "components/general/CustomComponents";
import { getColor, Color } from 'components/general/ColorPage'

/* Props Type */
type Props = {
    section: Dict,
    title: string,
    initialFormValues: Dict
    values: Dict,
    formSections: {
        [section: string]: {
            type: string;
            jsonPath: string;
            fields: FormField[];
        }
    },
    FlattenJSONPath: Function,
    SetFieldValue: Function,
    ConstructFormField: Function
};


/**
 * Component that renders a field array when rendering array instances in the form builder
 * @param section The form section to be rendered
 * @param title The title of the form section
 * @param initialFormValues The initial values of the form state
 * @param values The current values of the form state
 * @param formSections The original form sections array holding the different form sections
 * @param FlattenJSONPath Function to flatten a JSON path
 * @param SetFieldValue Function to set the value of a form field
 * @param ConstructFormField Function to construct a form field component based upon the provided field object
 * @returns JSX Component
 */
const FormBuilderFieldArray = (props: Props) => {
    const { section, title, initialFormValues, values, formSections, FlattenJSONPath, SetFieldValue, ConstructFormField } = props;
    /* Determine color */
    const color: Color = 'tc-' + getColor(window.location) as Color;
    
    return (
        <FieldArray name={section.jsonPath.replace('$', '')}>
            {({ push, remove }) => (
                <div className="mt-4">
                    <Row>
                        <Col>
                            <p className="fw-lightBold">{`${title}${title.at(-1) !== 'a' ? 's' : ''}`}</p>
                        </Col>
                        <Col lg="auto">
                            <Button type="button"
                                variant="blank"
                                className="px-0 py-0"
                                OnClick={() => {
                                    push(jp.value(initialFormValues, section.jsonPath)[0]);
                                }}
                            >
                                <p className={color}>
                                    {`Add ${title}`}
                                </p>
                            </Button>
                        </Col>
                    </Row>
                    {jp.value(values, section.jsonPath).map((_fields: Dict, index: number) => {
                        const key = `${section.jsonPath}-${index}`;
                        return (
                            <div key={key}
                                className="mt-2 px-3 py-2 b-grey"
                            >
                                <Row>
                                    <Col>
                                        <p className="fw-lightBold">
                                            {`${title} #${index + 1}`}
                                        </p>
                                    </Col>
                                    {jp.value(values, section.jsonPath).length > 1 &&
                                        <Col lg="auto">
                                            <Button type="button"
                                                variant="blank"
                                                OnClick={() => remove(index)}
                                            >
                                                <FontAwesomeIcon icon={faX}
                                                    className="tc-grey"
                                                />
                                            </Button>
                                        </Col>
                                    }
                                </Row>
                                <Row className="my-2">
                                    <Col>
                                        {formSections[MakeReadableString(FlattenJSONPath(section.jsonPath)).split(' ').slice(1).join(' ')].fields.map((field, localIndex) => {
                                            
                                            let localField = cloneDeep(field);

                                            localField.jsonPath = field.jsonPath.replace('index', String(index));

                                            return (
                                                <Row key={localField.jsonPath}
                                                    className={localIndex > 1 ? 'mt-3' : ''}
                                                >
                                                    <Col>
                                                        {ConstructFormField(localField, values, SetFieldValue, jp.value(values, localField.jsonPath))}
                                                    </Col>
                                                </Row>
                                            );
                                        })}
                                    </Col>
                                </Row>

                            </div>
                        );
                    })}
                </div>
            )}
        </FieldArray>
    );
};

export default FormBuilderFieldArray;