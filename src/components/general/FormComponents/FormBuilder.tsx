/* Import Dependencies */
import { useCaptchaHook } from "@aacn.eu/use-friendly-captcha";
import { Formik, Form, useFormikContext } from "formik";
import jp from 'jsonpath';
import { cloneDeep, isEmpty, merge } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/* Import Types */
import { FormField, Dict, TaxonomicExpert } from "app/Types";

/* Import API */
import InsertTaxonomicService from "api/taxonomicService/InsertTaxonomicService";
import InsertTaxonomicExpert from "api/taxonomicExpert/InsertTaxonomicExpert";
import UpdateTaxonomicExpert from "api/taxonomicExpert/UpdateTaxonomicExpert";

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
import IntField from "./IntField";
import { Button, Spinner } from "components/general/CustomComponents";
import { Color, getColor } from "components/general/ColorPage";
import ORCIDField from "./ORCIDField";
import ImageField from "./ImageField";
import MultiRORField from "./MultiRORField";
import { getRegistrationSession, updateRegistrationSession } from "api/auth/registrationSession";


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
    OrcidData: {
        orcid?: string;
        name?: string;
        email?: string;
    },
    TaxonomicExpert : TaxonomicExpert | null,
    Email: string | null,
    LockedFieldValues?: Record<string, unknown>,
    OnResetRegistration?: Function,
    SetCompleted: Function
};


/**
 * Component that renders a form builder for rendering forms based on JSON files
 * @param formTemplate The form template to build the form from
 * @returns JSX Component
 */
const FormBuilder = (props: Props) => {
    const { formTemplate, OrcidData, TaxonomicExpert, Email, LockedFieldValues, OnResetRegistration, SetCompleted } = props;

    console.log('taxonomicExpert', TaxonomicExpert);

    const isExpertForm = globalThis.location.pathname.includes('/te');

    const expertRecord: Dict | null = useMemo(() => {
        if (!TaxonomicExpert) {
            return null;
        }

        const candidate = TaxonomicExpert as unknown as Dict;

        if (candidate.taxonomicExpert && typeof candidate.taxonomicExpert === 'object') {
            return candidate.taxonomicExpert as Dict;
        }

        if (candidate.attributes?.content?.taxonomicExpert && typeof candidate.attributes.content.taxonomicExpert === 'object') {
            return candidate.attributes.content.taxonomicExpert as Dict;
        }

        if (candidate['schema:person'] || candidate['@id']) {
            return candidate;
        }

        return null;
    }, [TaxonomicExpert]);
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
    const color = getColor(globalThis.location) as Color;


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
                return '';
            default:
                return fieldConst ?? '';
        };
    };

    const initialFormValues: Dict = useMemo(() => {
        const values: Dict = {};
        const savedDraftValues = isExpertForm ? cloneDeep(getRegistrationSession().draftValues ?? {}) : {};

        const applyLockedFieldValues = (targetValues: Dict) => {
            Object.entries(LockedFieldValues ?? {}).forEach(([jsonPath, fieldValue]) => {
                if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
                    jp.value(targetValues, jsonPath, cloneDeep(fieldValue));
                }
            });
        };

        const ExtractPathSegments = (jsonPath: string): string[] => {
            const matches = [...jsonPath.matchAll(/\['([^']+)'\]/g)];
            return matches.map((match) => match[1]);
        };

        const AlternateSchemaKey = (key: string): string => {
            return key.startsWith('schema:')
                ? key.replace(/^schema:/, '')
                : `schema:${key}`;
        };

        const ResolveNextNodes = (nodes: unknown[], keyCandidates: string[]): unknown[] => {
            const nextNodes: unknown[] = [];

            for (const node of nodes) {
                if (!node || typeof node !== 'object') {
                    continue;
                }

                const dictNode = node as Dict;

                for (const candidateKey of keyCandidates) {
                    if (Object.hasOwn(dictNode, candidateKey)) {
                        nextNodes.push(dictNode[candidateKey]);
                    }
                }
            }

            return nextNodes;
        };

        const ResolvePathValue = (source: Dict, jsonPath: string): unknown => {
            const pathSegments = ExtractPathSegments(jsonPath);
            if (pathSegments.length === 0) {
                return undefined;
            }

            let currentNodes: unknown[] = [source];

            for (const pathSegment of pathSegments) {
                const keyCandidates = [pathSegment, AlternateSchemaKey(pathSegment)];
                const nextNodes = ResolveNextNodes(currentNodes, keyCandidates);

                if (nextNodes.length === 0) {
                    return undefined;
                }

                currentNodes = nextNodes;
            }

            return currentNodes.find((node) => node !== undefined && node !== null);
        };

        const ResolveExistingValue = (jsonPath: string): unknown => {
            if (!expertRecord) {
                return undefined;
            }

            const directValue = jp.value(expertRecord, jsonPath);
            if (directValue !== undefined && directValue !== null) {
                return directValue;
            }

            return ResolvePathValue(expertRecord, jsonPath);
        };

        Object.entries(formTemplate).forEach(([_key, formSection]) => {
            const existingSectionValue = expertRecord
                ? ResolveExistingValue(formSection.jsonPath ?? '')
                : undefined;

            if (formSection.type === 'array') {
                if (Array.isArray(existingSectionValue) && existingSectionValue.length > 0) {
                    jp.value(values, formSection.jsonPath ?? '', cloneDeep(existingSectionValue));
                } else {
                    jp.value(values, formSection.jsonPath ?? '', []);
                }
            }

            formSection.fields.forEach(field => {
                let jsonPath: string = '';
                const existingValue = ResolveExistingValue(field.jsonPath);

                if (field.jsonPath === "$['schema:person']['schema:affiliation']" && expertRecord?.['@id']) {
                    const existingAffiliation = existingValue as Dict | undefined;
                    const affiliationIdentifier = typeof existingAffiliation === 'object' && existingAffiliation !== null
                        ? (existingAffiliation['schema:identifier'] ?? existingAffiliation.identifier)
                        : undefined;
                    const hasValidAffiliation = typeof affiliationIdentifier === 'string' && affiliationIdentifier.trim() !== '';

                    if (!hasValidAffiliation) {
                        jp.value(values, "$['schema:person']['schema:noAffiliation']", true);
                        jp.value(values, field.jsonPath, {
                            '@type': 'schema:Organization',
                            'schema:identifier': '',
                            'schema:name': '',
                            'schema:url': ''
                        });
                        return;
                    }
                }

                if (formSection.type === 'array') {
                    let pathSuffix: string = FlattenJSONPath(field.jsonPath).split('_').at(-1) as string;

                    jsonPath = jsonPath.concat(`${formSection.jsonPath ?? ''}[0]['${pathSuffix}']`);
                    if (!(Array.isArray(existingSectionValue) && existingSectionValue.length > 0)) {
                        jp.value(values, jsonPath, DetermineInitialFormValue(field.type, field.const));
                    }
                } else if (existingValue !== undefined && existingValue !== null) {
                    jp.value(values, field.jsonPath, existingValue);
                } else if (field.jsonPath === "$['schema:person']['schema:orcid']" && expertRecord?.['@id']) {
                    jp.value(values, "$['schema:person']['schema:noOrcid']", true);
                    jp.value(values, field.jsonPath, '');
                } else if (field.jsonPath === "$['schema:person']['schema:name']" &&  OrcidData?.name) {
                    jp.value(values, field.jsonPath, OrcidData.name);
                }
                else if (field.jsonPath === "$['schema:person']['schema:email']" &&  OrcidData?.email) {
                    jp.value(values, field.jsonPath, OrcidData.email);
                }
                else if (field.jsonPath === "$['schema:person']['schema:email']" &&  Email) {
                    jp.value(values, field.jsonPath, Email);
                } else if (field.jsonPath === "$['schema:person']['schema:orcid']" &&  OrcidData?.orcid) {
                    jp.value(values, field.jsonPath, OrcidData.orcid);
                } else {
                    jp.value(values, field.jsonPath, DetermineInitialFormValue(field.type, field.const));
                }
            });
        });

        const mergedValues = merge({}, values, savedDraftValues);
        applyLockedFieldValues(mergedValues);

        return mergedValues;
    }, [Email, LockedFieldValues, OrcidData, expertRecord, formTemplate, isExpertForm]);
    
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
        const fieldWithState: FormField = {
            ...field,
            disabled: LockedFieldValues?.[field.jsonPath] !== undefined,
        };

        return generateFieldComponent(fieldWithState, fieldValues, SetFieldValue, values, setServiceTypes);
    };

    /**
     * Function to remove irrelevant classes from the form values object
     * @param obj The form values object
     */
    const CheckForIrrelevantClasses = (obj: Dict) => {
        Object.keys(obj).forEach(key => {
            if (Object.values(inactiveFormSections).some(values => values.jsonPath === `$['${key}']`)) {
                delete obj[key];
            }
        });
    };

    return (
        <div>
            <Formik initialValues={initialFormValues}
                enableReinitialize={true}
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
                                const noOrcidSelected = jp.value(values, "$['schema:person']['schema:noOrcid']") === true;

                                if (field.jsonPath === "$['schema:person']['schema:orcid']" && noOrcidSelected) {
                                    return;
                                }

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
                                if (isEmpty(obj[key]) || (Array.isArray(obj[key]) && !obj[key].some((value: string) => !!value))) {
                                    delete obj[key];
                                } else if (typeof obj[key] === 'object') {
                                    RemoveEmptyProperties(obj[key]);
                                }
                            };
                        };

                        if (globalThis.location.pathname.includes('/ts')) {
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
                        } else if (globalThis.location.pathname.includes('/te')) {
                            Object.entries(LockedFieldValues ?? {}).forEach(([jsonPath, fieldValue]) => {
                                if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
                                    jp.value(values, jsonPath, cloneDeep(fieldValue));
                                }
                            });

                            if (OrcidData?.orcid) {
                                jp.value(values, "$['schema:person']['schema:orcid']", OrcidData.orcid);
                            }
                            if (Email) {
                                jp.value(values, "$['schema:person']['schema:email']", Email);
                            }
                            let taxonomicExpertRecord = cloneDeep(values);

                            if (taxonomicExpertRecord?.['schema:person']) {
                                delete taxonomicExpertRecord['schema:person']['schema:noOrcid'];
                                delete taxonomicExpertRecord['schema:person']['schema:noAffiliation'];
                            }

                            RemoveEmptyProperties(taxonomicExpertRecord);
                            CheckForIrrelevantClasses(taxonomicExpertRecord);

                            try {
                                if (expertRecord?.['@id']) {
                                    await UpdateTaxonomicExpert({
                                        id: expertRecord['@id'],
                                        updatedData: taxonomicExpertRecord
                                    });
                                } else {
                                    await InsertTaxonomicExpert({
                                        taxonomicExpertRecord
                                    });
                                }

                                updateRegistrationSession({
                                    completed: true,
                                    draftValues: cloneDeep(values),
                                });
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
                        <FormSessionSync enabled={isExpertForm} />
                        <LockedFieldSync lockedFieldValues={LockedFieldValues} />
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
                                                            className="mt-3 mt-lg-3"
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
                        {!globalThis.location.pathname.includes('/ts') && (
                            <Row className="mt-3">
                                <Col>
                                    <div>
                                        <p className="fw-lightBold mb-2">Consent and data publication</p>
                                        <p className="mb-2">By submitting this form, you confirm that:</p>
                                        <ul className="mb-3">
                                            <li>You voluntarily provide the information for inclusion in the CETAF Taxonomic e-Services and Expertise Marketplace.</li>
                                            <li>Your profile information will be publicly visible in the Marketplace after a short verification process carried out by CETAF.</li>
                                            <li>Your email address will not be shared publicly. It will be protected behind a contact mechanism to reduce spam, and used only to enable contact related to your expertise.</li>
                                            <li>You consent to being contacted in relation to your registered expertise or services.</li>
                                        </ul>
                                        <p className="mb-2">You understand that:</p>
                                        <ul className="mb-3">
                                            <li>The Marketplace is a discovery and contact platform. CETAF does not evaluate, certify or endorse individual experts or services.</li>
                                            <li>You may request access, correction, or deletion of your data at any time by contacting CETAF.</li>
                                        </ul>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="consentCheck"
                                                required
                                            />
                                            <label className="form-check-label" htmlFor="consentCheck">
                                                I have read and agree to the consent and data publication terms above and the <Link to="/policy" className="tc-tertiary" target="_blank" rel="noopener noreferrer">policy</Link>
                                            </label>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        )}
                        {!globalThis.location.pathname.includes('/te') && (
                            <Row className="mt-3">
                                <Col>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="policyCheck"
                                            required
                                        />
                                        <label className="form-check-label" htmlFor="policyCheck">
                                            I agree to the <Link to="/policy" className="tc-tertiary" target="_blank" rel="noopener noreferrer">policy</Link>
                                        </label>
                                    </div>
                                </Col>
                            </Row>
                        )}
                        <Row className="mt-3">
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
                                    {isExpertForm && OnResetRegistration &&
                                        <Col lg="auto" className="mt-2 mt-lg-0">
                                            <Button type="button"
                                                variant="blank"
                                                OnClick={() => OnResetRegistration()}
                                            >
                                                <p>
                                                    Go back to search expert
                                                </p>
                                            </Button>
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

const FormSessionSync = ({ enabled }: { enabled: boolean }) => {
    const { values } = useFormikContext<Dict>();

    useEffect(() => {
        if (!enabled) {
            return;
        }

        updateRegistrationSession({
            draftValues: cloneDeep(values),
        });
    }, [enabled, values]);

    return null;
};

const LockedFieldSync = ({ lockedFieldValues }: { lockedFieldValues?: Record<string, unknown> }) => {
    const { values, setFieldValue } = useFormikContext<Dict>();

    useEffect(() => {
        Object.entries(lockedFieldValues ?? {}).forEach(([jsonPath, fieldValue]) => {
            if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
                return;
            }

            const currentValue = jp.value(values, jsonPath);
            if (currentValue === fieldValue) {
                return;
            }

            setFieldValue(jsonPath.replace('$', ''), cloneDeep(fieldValue), false);
        });
    }, [lockedFieldValues, setFieldValue, values]);

    return null;
};

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
            if (field.title === 'Taxonomic sub-discipline') {

                // Define sub-disciplines for each main discipline
                const disciplineSubgroups = {
                    "botany": [
                        "Algae",
                        "Bryophytes",
                        "Macrofungi, Lichens & Myxomycetes (Mycology)",
                        "Plant Genetic Resources",
                        "Pteridophytes",
                        "Seed plants"
                    ],
                    
                    "invertebrates": [
                        "Arachnids",
                        "Cnidaria (jellyfish, coral, anemones)",
                        "Crustaceans & Myriapods",
                        "Echinodermata (starfish, sea urchins, sea cucumbers)",
                        "Insects",
                        "Invertebrates Genetic Resources",
                        "Mollusca (bivalves, gastropods, cephalopods)",
                        "Porifera (Sponges)",
                        "Other Invertebrate Zoology"
                    ],
                    
                    "vertebrates": [
                        "Amphibians",
                        "Birds",
                        "Fishes",
                        "Mammals",
                        "Reptiles",
                        "Vertebrates Genetic Resources",
                        "Other Vertebrate Zoology"
                    ],
                    
                    "palaeontology": [
                        "Fossil Invertebrates",
                        "Fossil Plants & Fungi",
                        "Fossil Vertebrates",
                        "Other Palaeontology"
                    ],
                    
                    "microbiology": [
                        "Algae (in microbiology collection)",
                        "Bacteria & Archaea",
                        "Eukaryotic Microorganisms",
                        "Microfungi (including moulds, yeasts)",
                        "Phages",
                        "Plasmids",
                        "Protozoa",
                        "Viruses",
                        "Other Microbiology Objects (e.g. mixed or other kinds of microorganisms)"
                    ],
                    
                    "ecoEnvDNA": [
                        "ECO-DNA (environmental DNA)",
                        "ECO-OTH"
                    ]
                };
                
                // Initialize empty options array
                field.options = [];
                
                // Get the selected disciplines
                const selectedDisciplines = Array.isArray(values['schema:Taxon']['schema:discipline']) 
                  ? values['schema:Taxon']['schema:discipline'] 
                  : [values['schema:Taxon']['schema:discipline']];
                
                // Add sub-disciplines for each selected discipline
                selectedDisciplines.forEach(discipline => {
                  const key = discipline as keyof typeof disciplineSubgroups;
                  if (disciplineSubgroups[key]) {
                    // Add the sub-disciplines to the options array
                    disciplineSubgroups[key].forEach(subgroup => {
                        field.options?.push(`${subgroup}`);
                    });
                  }
                });
                return <MultiSelectField field={field}
                    values={values}
                    SetFieldValue={(fieldName: string, value: string) => SetFieldValue(fieldName, value)}
                />;
            }
            else { 
                return <MultiSelectField field={field}
                    values={values}
                    SetFieldValue={(fieldName: string, value: string) => SetFieldValue(fieldName, value)}
                    SetServiceTypes={field.title === 'Service Type' ? (serviceTypes: string[]) => setServiceTypes(serviceTypes) : undefined} />;
            }
        } case 'orcid': {
            return <ORCIDField field={field}
                fieldValue={fieldValues as Dict}
                values={values}
                SetFieldValue={(fieldName: string, value: Dict) => {
                    SetFieldValue?.(fieldName, value);
                } } />;
        } case 'ror': {
            return <RORField field={field}
                fieldValue={fieldValues as Dict}
                values={values}
                SetFieldValue={(fieldName: string, value: Dict) => {
                    SetFieldValue?.(fieldName, value);
                } } />;
        } case 'multi-ror': {
            return <MultiRORField field={field}
                fieldValue={fieldValues as Dict[]}
                values={values}
                SetFieldValue={(fieldName: string, value: Dict) => {
                    SetFieldValue?.(fieldName, value);
                } } />;
        } case 'softwareLicense': {
            return <SoftwareLicenses field={field}
                SetFieldValue={(fieldName: string, value: string) => SetFieldValue(fieldName, value)} />;
        } case 'text': {
            return <TextField field={field}
                fieldValue={fieldValues as string}
                values={values}
                SetFieldValue={(fieldName: string, value: string) => SetFieldValue(fieldName, value)} />;
        } case 'int': {
            return <IntField field={field}
                values={values} />;
        } case 'image': {
            return <ImageField field={field}
                values={values} />
        } default: {
            return <StringField field={field}
                values={values} />;
        }
    };
}
