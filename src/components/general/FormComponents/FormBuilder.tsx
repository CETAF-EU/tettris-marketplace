/* Import Dependencies */
import { useCaptchaHook } from "@aacn.eu/use-friendly-captcha";
import { Formik, Form } from "formik";
import jp from 'jsonpath';
import { cloneDeep, isEmpty } from "lodash";
import { useState } from "react";
import { Row, Col } from 'react-bootstrap';

/* Import Types */
import { FormField, Dict } from "app/Types";

/* Import API */
import InsertTaxonomicService from "api/taxonomicService/InsertTaxonomicService";
import InsertTaxonomicExpert from "api/taxonomicExpert/InsertTaxonomicExpert";

/* Import Components */
import BooleanField from "./BooleanField";
import DateField from "./DateField";
import FormBuilderFieldArray from "./FormBuilderFieldArray";
import HiddenField from "./HiddenField";
import MultiSelectField from "./MultiSelectField";
import RORField from "./RORField";
import SelectField from "./SelectField";
import SoftwareLicenses from "./SoftwareLicenses";
import StringField from "./StringField";
import StringArrayField from "./StringArrayField";
import TextField from "./TextField";
import { Button, Spinner } from "components/general/CustomComponents";
import { Color, getColor } from "components/general/ColorPage";


/* Props Type */
type Props = {
    formTemplate: {
        [formSection: string]: {
            title: string,
            type: string,
            jsonPath?: string,
            fields: FormField[],
            applicableToServiceTypes?: string[]
        }
    },
    SetCompleted: Function
};


/**
 * Component that renders a form builder for rendering forms based on JSON files
 * @param formTemplate The form template to build the form from
 * @returns JSX Component
 */
const FormBuilder = (props: Props) => {
    const { formTemplate, SetCompleted } = props;

    /* Hooks */
    const captchaHook = useCaptchaHook({
        siteKey: import.meta.env.VITE_FRIENDLY_CAPTCHA_SITEKEY,
        endpoint: "GLOBAL1",
        language: "en",
        startMode: "none",
        showAttribution: true
    });

    /* Base variables */
    /* Determine color */
    const color = getColor(window.location) as Color;


    const [serviceTypes, setServiceTypes] = useState<string[] | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>();
    const formSections: {
        [section: string]: {
            type: string,
            jsonPath: string,
            fields: FormField[],
            applicableToServiceTypes?: string[]
        }
    } = {};
    const inactiveFormSections: {
        [section: string]: {
            type: string,
            jsonPath: string,
            fields: FormField[],
            applicableToServiceTypes?: string[]
        }
    } = {};

    const initialFormValues: Dict = {};

    /**
     * Function to flatten a JSON path
     * @returns flattened JSON path string
     */
    const FlattenJSONPath = (jsonPath: string): string => {
        return jsonPath.replaceAll('[', '_').replaceAll(']', '').replaceAll("'", '');
    };

    /**
     * Function to determine the initial form field type 
     * @param fieldType
     */
    const DetermineInitialFormValue = (fieldType: string, fieldConst?: string) => {
        switch (fieldType) {
            case 'boolean':
                return false;
            case 'array':
                return [];
            case 'multi-string':
                return [''];
            case 'ror':
                return {
                    "@type": "schema:Organization",
                    "schema:identifier": '',
                    "schema:name": ''
                };
            default:
                return fieldConst ?? '';
        };
    };

    /* Construct initial form values */
    if (isEmpty(initialFormValues)) {
        Object.entries(formTemplate).forEach(([_key, formSection]) => {
            if (formSection.type === 'array') {
                jp.value(initialFormValues, formSection.jsonPath ?? '', []);
            }

            formSection.fields.forEach(field => {
                let jsonPath: string = '';

                if (formSection.type === 'array') {
                    let pathSuffix: string = FlattenJSONPath(field.jsonPath).split('_').at(-1) as string;

                    jsonPath = jsonPath.concat(`${formSection.jsonPath ?? ''}[0]['${pathSuffix}']`);
                    jp.value(initialFormValues, jsonPath, DetermineInitialFormValue(field.type, field.const));
                // } else if (field.jsonPath === "$['schema:person']['schema:name']" ) {
                //     // Here we check if it's the 'Full Name' field and prefill it
                //     jp.value(initialFormValues, field.jsonPath, "John Doe");
                } else {
                    jp.value(initialFormValues, field.jsonPath, DetermineInitialFormValue(field.type, field.const));
                }
            });
        });
    }

    /* Construct form sections */
    Object.entries(formTemplate).forEach(([_key, formSection]) => {
        if ((serviceTypes && formSection.applicableToServiceTypes?.some(type => serviceTypes.includes(type))) || !formSection.applicableToServiceTypes || !serviceTypes) {
            formSections[formSection.title] = {
                type: formSection.type,
                jsonPath: formSection.jsonPath ?? '',
                fields: [],
                applicableToServiceTypes: formSection.applicableToServiceTypes
            };

            formSection.fields.forEach(field => {
                /* Push to form fields */
                formSections[formSection.title].fields.push(field);
            });
        } else {
            inactiveFormSections[formSection.title] = {
                type: formSection.type,
                jsonPath: formSection.jsonPath ?? '',
                fields: [],
                applicableToServiceTypes: formSection.applicableToServiceTypes
            };

            formSection.fields.forEach(field => {
                /* Push to form fields */
                inactiveFormSections[formSection.title].fields.push(field);
            });
        }
    });

    /**
     * Function to construct form field based upon given field 
     * @param field The provided form field definition
     * @param values The current values object of the form
     * @param SetFieldValue Function to set the value of a form field
     * @param fieldValues The current field values of the form field
     * @returns JSX Component of form field
     */
    const ConstructFormField = (field: FormField, values: Dict, SetFieldValue: Function, fieldValues?: any) => {
        return generateFieldComponent(field, fieldValues, SetFieldValue, values, setServiceTypes);
    };

    /**
     * Function to remove irrelevant classes from the form values object
     * @param obj The form values object
     */
    const CheckForIrrelevantClasses = (obj: Dict) => {
        Object.keys(obj).forEach(key => {
            if (Object.values(inactiveFormSections).find(values => values.jsonPath === `$['${key}']`)) {
                delete obj[key];
            }
        });
    };

    return (
        <div>
            <Formik initialValues={initialFormValues}
                onSubmit={async (values) => {
                    await new Promise((resolve) => setTimeout(resolve, 100));

                    /* Check if all required fields are present */
                    let validationFlag: boolean = true;

                    const ValidateArrayComponentObject = (value: Dict) => {
                        Object.values(value).forEach(subValue => {
                            if (isEmpty(subValue)) {
                                // ! \\ DEBUG TO ACCEPT EMPTY ROR affiliation
                                if (value.hasOwnProperty('schema:affiliation')) {
                                    validationFlag = false;
                                }
                            }
                        });
                    };

                    const ValidateArrayComponent = (field: Dict) => {
                        Object.values(field).forEach(value => {
                            if (Array.isArray(value) && isEmpty(value)) {
                                validationFlag = false;
                            } else if (typeof (value) === 'object') {
                                ValidateArrayComponentObject(value);
                            } else if (!value) {
                                validationFlag = false;
                            }
                        });
                    };

                    const ValidateArray = (fieldArray: Dict[]) => {
                        fieldArray.forEach(field => {
                            if (typeof (field) === 'object') {
                                ValidateArrayComponent(field);
                            }
                        });
                    };

                    Object.values(formSections).forEach(formSection => {
                        if ((formSection?.applicableToServiceTypes?.some(type => values['schema:service']['schema:serviceType'].includes(type))) || !formSection.applicableToServiceTypes) {
                            formSection.fields.filter(field => field.required).forEach(field => {
                                if (field.jsonPath.includes('index')) {
                                    const array = jp.value(values, field.jsonPath.split("['index']").at(0) as string);

                                    ValidateArray(array);
                                } else if (isEmpty(jp.value(values, field.jsonPath))) {
                                    validationFlag = false;
                                }
                            });
                        }
                    });

                    if (validationFlag && captchaHook.captchaStatus.solution !== null) {
                        /* Start loading indication */
                        setLoading(true);

                        /**
                         * Function to search for and remove empty properties in the given form values object
                         * @param obj The form values object
                         */
                        const RemoveEmptyProperties = (obj: Dict) => {
                            for (const key in obj) {
                                if (isEmpty(obj[key]) || (Array.isArray(obj[key]) && !obj[key].find((value: string) => !!value))) {
                                    delete obj[key];
                                } else if (typeof obj[key] === 'object') {
                                    RemoveEmptyProperties(obj[key]);
                                }
                            };
                        };

                        if (window.location.pathname.includes('/ts')) {
                            let taxonomicServiceRecord = cloneDeep(values);

                            RemoveEmptyProperties(taxonomicServiceRecord);
                            CheckForIrrelevantClasses(taxonomicServiceRecord);

                            try {
                                await InsertTaxonomicService({
                                    taxonomicServiceRecord
                                })

                                SetCompleted();
                            } catch {
                                setErrorMessage('Something went wrong during the submission of the Taxonomic Service, please try again');
                            } finally {
                                setLoading(false);
                            };
                        } else if (window.location.pathname.includes('/te')) {  
                            let taxonomicExpertRecord = cloneDeep(values);

                            RemoveEmptyProperties(taxonomicExpertRecord);
                            CheckForIrrelevantClasses(taxonomicExpertRecord);

                            try {
                                await InsertTaxonomicExpert({
                                    taxonomicExpertRecord
                                })

                                SetCompleted();
                            } catch {
                                setErrorMessage('Something went wrong during the submission of the Taxonomic Expert, please try again');
                            } finally {
                                setLoading(false);
                            };
                        }
                    } else {
                        setErrorMessage('Please provide values for all required fields')
                    }
                }}
            >
                {({ values, setFieldValue }) => (
                    <Form>
                        {Object.entries(formSections).map(([title, section]) => (
                            <div key={title}>
                                {((serviceTypes && section.applicableToServiceTypes?.some(type => serviceTypes.includes(type))) || !section.applicableToServiceTypes) &&
                                    <Row key={title}>
                                        <Col>
                                            {section.type === 'object' ?
                                                <div className="mt-4">
                                                    <p className="fw-lightBold">{`${title}`}</p>

                                                    {section.fields.map(field => (
                                                        <Row key={field.jsonPath}
                                                            className="mt-3 mt-lg-2"
                                                        >
                                                            <Col>
                                                                {ConstructFormField(field, values, setFieldValue, jp.value(values, field.jsonPath))}
                                                            </Col>
                                                        </Row>
                                                    ))}
                                                </div>
                                                : <FormBuilderFieldArray section={section}
                                                    title={title}
                                                    initialFormValues={initialFormValues}
                                                    values={values}
                                                    formSections={formSections}
                                                    FlattenJSONPath={FlattenJSONPath}
                                                    SetFieldValue={setFieldValue}
                                                    ConstructFormField={ConstructFormField}
                                                />
                                            }
                                        </Col>
                                    </Row>
                                }
                            </div>
                        ))}
                        <Row className="mt-3">
                            <Col>
                                {captchaHook.CaptchaWidget({ className: 'min-w-full pl-2 pb-1 mt-6 bg-cyan-800 rounded' })}
                            </Col>
                        </Row>
                        {errorMessage &&
                            <Row className="mt-3">
                                <Col>
                                    <p className="fs-4 tc-error">
                                        {errorMessage}
                                    </p>
                                </Col>
                            </Row>
                        }
                        <Row className="mt-5">
                            <Col>
                                <Row>
                                    <Col lg="auto">
                                        <Button type="submit"
                                            variant={color}
                                            disabled={captchaHook.captchaStatus.solution === null}
                                        >
                                            <p>
                                                Submit
                                            </p>
                                        </Button>
                                    </Col>
                                    {loading &&
                                        <Col>
                                            <Spinner />
                                        </Col>
                                    }
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default FormBuilder;

function generateFieldComponent(field: FormField, fieldValues: any, SetFieldValue: Function, values: Dict, setServiceTypes: (serviceTypes: string[]) => void) {
    switch (field.type) {
        case 'hidden': {
            return <HiddenField field={field} />;
        } case 'boolean': {
            return <BooleanField field={field} />;
        } case 'date': {
            let dateValue: Date;

            if (fieldValues) {
                dateValue = new Date(fieldValues);
            } else {
                dateValue = new Date();
            }

            return <DateField field={field}
                fieldValue={dateValue}
                SetFieldValue={(fieldName: string, value: string) => SetFieldValue(fieldName, value)} />;
        } case 'multi-string': {
            return <StringArrayField field={field}
                fieldValues={fieldValues as string[]}
                values={values} />;
        } case 'select': {
            return <SelectField field={field}
                values={values}
                SetFieldValue={(fieldName: string, value: string) => SetFieldValue(fieldName, value)} />;
        } case 'multi-select': {
            return <MultiSelectField field={field}
                values={values}
                SetFieldValue={(fieldName: string, value: string) => SetFieldValue(fieldName, value)}
                SetServiceTypes={field.title === 'Service Type' ? (serviceTypes: string[]) => setServiceTypes(serviceTypes) : undefined} />;
        } case 'ror': {
            return <RORField field={field}
                fieldValue={fieldValues as Dict}
                values={values}
                SetFieldValue={(fieldName: string, value: Dict) => {
                    SetFieldValue?.(fieldName, value);
                } } />;
        } case 'softwareLicense': {
            return <SoftwareLicenses field={field}
                SetFieldValue={(fieldName: string, value: string) => SetFieldValue(fieldName, value)} />;
        } case 'text': {
            return <TextField field={field}
                values={values}
                SetFieldValue={(fieldName: string, value: string) => SetFieldValue(fieldName, value)} />;
        } default: {
            return <StringField field={field}
                values={values} />;
        }
    };
}
