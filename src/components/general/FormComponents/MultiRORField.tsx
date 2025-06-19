/* Import Dependencies */
import classNames from 'classnames';
import { Field } from "formik";
import { isEmpty } from "lodash";
import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import Select from "react-select";

/* Import Types */
import { FormField, Dict, DropdownItem } from "app/Types";

/* Import API */
import GetRORsByName from 'api/ror/GetRORsByName';

/* Import Components */
import { Button, Spinner } from 'components/general/CustomComponents';
import { getColor, Color } from 'components/general/ColorPage'

/* Props Type */
type Props = {
    field: FormField,
    fieldValue: Dict[] | Dict, // Modified to accept array
    values: Dict,
    SetFieldValue: Function
};

/**
 * Component that renders a dynamic multiple ROR field for defining organisation (affiliation) identifiers and names
 */
const MultiRORField = (props: Props) => {
    const { field, fieldValue, values, SetFieldValue } = props;

    // Convert fieldValue to array if it's not already
    let nonArrayValue: Dict[];
    if (isEmpty(fieldValue)) {
        nonArrayValue = [];
    } else {
        nonArrayValue = [fieldValue as Dict];
    }
    const fieldValueArray = Array.isArray(fieldValue) ? fieldValue : nonArrayValue;
    
    /* Base variables */
    const [queries, setQueries] = useState<string[]>(Array(fieldValueArray.length || 1).fill(''));
    const [loading, setLoading] = useState<boolean[]>(Array(fieldValueArray.length || 1).fill(false));
    const [dropdownOptions, setDropdownOptions] = useState<(DropdownItem[] | undefined)[]>(Array(fieldValueArray.length || 1).fill(undefined));

    /* Determine variant */
    const variant: Color = getColor(window.location) as Color;

    /**
     * Function to search for RORs and fill the dropdown with options
     */
    const SearchForROR = async (index: number) => {
        const newLoading = [...loading];
        newLoading[index] = true;
        setLoading(newLoading);

        const rors = await GetRORsByName({ query: queries[index] });

        /* Construct dropdown items from ROR */
        const options: DropdownItem[] = [
            {
                label: 'Select an organisation',
                value: '',
                url: ''
            }
        ];

        rors.forEach(ror => {
            options.push({
                label: ror?.names.find((nameObject: { lang: string, value: string }) => nameObject?.lang === 'en')?.value ?? ror?.names[0].value ?? '',
                value: ror.id,
                url: ror?.links?.find((link: { type: string, value: string }) => link.type === 'website')?.value ?? 'N/A'
            });
        });

        const newDropdownOptions = [...dropdownOptions];
        newDropdownOptions[index] = options;
        setDropdownOptions(newDropdownOptions);

        newLoading[index] = false;
        setLoading(newLoading);
    };

    const addFunder = () => {
        setQueries([...queries, '']);
        setLoading([...loading, false]);
        setDropdownOptions([...dropdownOptions, undefined]);
        
        // Update the field value in the form
        const newFieldValue = [...fieldValueArray, {}];
        SetFieldValue(field.jsonPath.replace('$', ''), newFieldValue);
    };

    const removeFunder = (index: number) => {
        const newQueries = [...queries];
        newQueries.splice(index, 1);
        setQueries(newQueries);

        const newLoading = [...loading];
        newLoading.splice(index, 1);
        setLoading(newLoading);

        const newDropdownOptions = [...dropdownOptions];
        newDropdownOptions.splice(index, 1);
        setDropdownOptions(newDropdownOptions);

        // Update the field value in the form
        const newFieldValue = [...fieldValueArray];
        newFieldValue.splice(index, 1);
        SetFieldValue(field.jsonPath.replace('$', ''), newFieldValue);
    };

    /* Class Names */
    const formFieldClass = classNames({
        'b-error': (field.required && !isEmpty(values) && isEmpty(fieldValueArray))
    });

    return (
        <div>
            <Row>
                <Col xs={{ span: 12 }} lg="auto" className="pe-0">
                    <p>{field.title}</p>
                </Col>
                {(field.required && !isEmpty(values) && isEmpty(fieldValueArray)) &&
                    <Col className="d-flex align-items-center">
                        <p className="fs-5 fs-lg-4 tc-error">
                            This field is required
                        </p>
                    </Col>
                }
                <Row>
                    <Col>
                        <p className="fs-5 tc-grey">{field.description}</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p className="fs-5 tc-grey">
                            Using the ROR lookup will use the identifier and name of the selected organisation
                        </p>
                    </Col>
                </Row>
            </Row>

            {fieldValueArray.map((value, index) => (
                <div key={value['schema:identifier'] ?? index} className="mb-4 pb-3 border-bottom">
                    <Row className="mt-1">
                        <Col xs={{ span: 12 }} lg>
                            <Field name={`rorSearch-${index}`}
                                className={`${formFieldClass} w-100 br-corner px-2 py-1`}
                                onChange={(e: Dict) => {
                                    const newQueries = [...queries];
                                    newQueries[index] = e.target.value;
                                    setQueries(newQueries);
                                }}
                                value={queries[index]}
                            />
                        </Col>
                        {loading[index] &&
                            <Col xs="auto" lg="auto">
                                <Spinner />
                            </Col>
                        }
                        <Col xs="auto" lg="auto">
                            <Button type="button"
                                variant={variant}
                                className="fs-5 fs-lg-4 mt-2 mt-lg-0"
                                OnClick={() => SearchForROR(index)}
                            >
                                <p>Search for ROR</p>
                            </Button>
                        </Col>
                        <Col xs="auto" lg="auto">
                            <Button type="button"
                                variant="primary"
                                className="fs-5 fs-lg-4 mt-2 mt-lg-0"
                                OnClick={() => removeFunder(index)}
                                disabled={fieldValueArray.length <= 1}
                            >
                                <p>Remove</p>
                            </Button>
                        </Col>
                    </Row>
                    {dropdownOptions[index] &&
                        <Row className="mt-2">
                            <Col>
                                <Select
                                    options={dropdownOptions[index]?.map(item => ({
                                        label: item.label,
                                        value: item.value,
                                        url: item.url ?? ''
                                    }))}
                                    value={value['schema:identifier'] ? {
                                        label: value['schema:name'],
                                        value: value['schema:identifier'],
                                        url: value['schema:url'] ?? ''
                                    } : undefined}
                                    placeholder="Select an option"
                                    className={formFieldClass}
                                    onChange={(option) => {
                                        const jsonPath = `${field.jsonPath.replace('$', '')}[${index}]`;
                                        
                                        if (option?.value === '') {
                                            SetFieldValue(jsonPath, {});
                                        } else {
                                            SetFieldValue(jsonPath, {
                                                "@type": "schema:Organization",
                                                "schema:identifier": option?.value,
                                                "schema:name": option?.label,
                                                "schema:url": option?.url
                                            });
                                        }
                                    }}
                                />
                            </Col>
                        </Row>
                    }
                </div>
            ))}
            
            <Row className="mt-3">
                <Col>
                    <Button type="button"
                        variant={variant}
                        className="fs-5 fs-lg-4"
                        OnClick={addFunder}
                    >
                        <p>Add Another Funder</p>
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default MultiRORField;