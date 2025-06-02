/* Import Dependencies */
import classNames from 'classnames';
import { Field } from "formik";
import jp from 'jsonpath';
import { isEmpty } from "lodash";
import { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import Select from "react-select";

/* Import Types */
import { FormField, Dict, DropdownItem } from "app/Types";

/* Import API */
import { GetOrcidByName } from 'api/orcid/GetOrcidByName';

/* Import Components */
import { Button, Spinner } from 'components/general/CustomComponents';
import { getColor, Color } from 'components/general/ColorPage'
import checkIfOrcidExists from 'api/orcid/checkIfOrcidExists';

/* Props Type */
type Props = {
    field: FormField,
    fieldValue: Dict,
    values: Dict,
    SetFieldValue: Function
};


/**
 * Component that renders a dynamic ROR field for defining the organisation (affiliation) identifier and name
 * @param field The provided form field
 * @param fieldValue The current value of the field
 * @param values The current values of the form state
 * @param SetFieldValue Function to set the value of a field in the form
 * @returns JSX Component
 */
const ORCIDField = (props: Props) => {
    const { field, fieldValue, values, SetFieldValue } = props;

    /* Base variables */
    const [query, setQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [dropdownOptions, setDropdownOptions] = useState<DropdownItem[] | undefined>();
    const [orcidExists, setOrcidExists] = useState<boolean>(false);
    /* Determine variant */
    const variant: Color = getColor(window.location) as Color;
    /**
     * Function to search for RORs and fill the dropdown with options
     */

    useEffect(() => {
    }, [values]);

    const validateOrcid = async (orcid: string) => {
        let jsonPath: string = '';

        /* Format JSON path */
        field.jsonPath.split('][').forEach(pathSegment => {
            const localPathSegment = pathSegment.replace('$', '').replace('[', '').replace(']', '').replaceAll("'", '');

            if (!isNaN(Number(localPathSegment))) {
                jsonPath = jsonPath.concat(`[${localPathSegment}]`);
            } else {
                jsonPath = jsonPath.concat(`['${localPathSegment}']`);
            }
        });
        if (typeof orcid === 'string' && orcid.trim() !== '') {
            const exists = await checkIfOrcidExists(orcid.trim());
            if (exists !== null) {
                setOrcidExists(true);
                console.log('not right', fieldValue);
                SetFieldValue(jsonPath, '');
                console.log('reset not right', fieldValue);
            }
            else {
                setOrcidExists(false);
                SetFieldValue(jsonPath, orcid.trim());
                console.log('right', fieldValue);
            }
        } else {
            setOrcidExists(false);
            console.log('not not right', fieldValue);
            SetFieldValue(jsonPath, '');
            console.log('reset not not right', fieldValue);
        }
    };

    const SearchForOrcid = async () => {
        setLoading(true);

        const orcids = await GetOrcidByName(query);
        console.log(orcids);
        /* Reset field name */
        SetFieldValue(field.jsonPath.replace('$', ''), {
            "schema:identifier": '',
            "schema:name": '',
        });

        /* Construct dropdown items from ROR */
        const dropdownOptions: DropdownItem[] = [
            {
                label: 'Select an organisation',
                value: '',
            }
        ];

        orcids.forEach(orcid => {
            dropdownOptions.push({
                label: orcid?.name,
                value: orcid?.identifier,
            });
        })

        setDropdownOptions(dropdownOptions);
        setLoading(false);
    };

    /* Class Names */
    const formFieldClass = classNames({
        'b-error': (
            (field.required && !isEmpty(values) &&
                (typeof jp.value(values, field.jsonPath) !== 'string' ||
                isEmpty(jp.value(values, field.jsonPath))))
            || orcidExists
        )
    });

    return (
        <div>
            <Row>
                <Col xs={{ span: 12 }} lg="auto"
                    className="pe-0"
                >
                    <p>
                        {field.title}
                    </p>
                </Col>
                {((field.required && !isEmpty(values) && (typeof jp.value(values, field.jsonPath) !== 'string' || isEmpty(jp.value(values, field.jsonPath)))) || orcidExists) &&
                    <Col className="d-flex align-items-center">
                        <p className="fs-5 fs-lg-4 tc-error">

                            {orcidExists ?  "This ORCID number already exists in the database" : "This field is required"  }
                        </p>
                    </Col>
                }
                <Row>
                    <Col>
                        <p className="fs-5 tc-grey">
                            {field.description}
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p className="fs-5 tc-grey">
                            Using the Orcid lookup will use the identifier and name of the selected expert
                        </p>
                    </Col>
                </Row>
            </Row>
            <Row className="mt-1">
                <Col xs={{ span: 12 }} lg>
                    <Field name="orcidSearch"
                        className={`${formFieldClass} w-100 br-corner px-2 py-1`}
                        onChange={(field: Dict) => setQuery(field.target.value as string)}
                    />
                </Col>
                {loading &&
                    <Col xs="auto" lg="auto">
                        <Spinner />
                    </Col>
                }
                <Col xs="auto" lg="auto">
                    <Button type="button"
                        variant={variant}
                        className="fs-5 fs-lg-4 mt-2 mt-lg-0"
                        OnClick={() => SearchForOrcid()}
                    >
                        <p>
                            Search for Orcid
                        </p>
                    </Button>
                </Col>
            </Row>
            {/* Display ROR selection dropdown if dropdown options is not undefiend */}
            {dropdownOptions &&
                <Row className="mt-2">
                    <Col>
                        <Select
                            options={dropdownOptions as { label: any; value: any; url: any; }[]}
                            value={fieldValue['schema:identifier'] ? {
                                label: fieldValue['schema:name'],
                                value: fieldValue['schema:identifier'],
                            } : undefined}
                            placeholder="Select an option"
                            className={formFieldClass}
                            onChange={(dropdownOption) => {
                                validateOrcid(dropdownOption?.value)
                            }}
                        />
                    </Col>
                </Row>
            }
        </div>
    );
};

export default ORCIDField;