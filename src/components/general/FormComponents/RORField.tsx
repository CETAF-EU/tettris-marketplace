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
import GetRORsByName from 'api/ror/GetRORsByName';

/* Import Components */
import { Button, Spinner } from 'components/general/CustomComponents';
import { getColor, Color } from 'components/general/ColorPage'

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
const RORField = (props: Props) => {
    const { field, fieldValue, values, SetFieldValue } = props;

    /* Base variables */
    const [query, setQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [dropdownOptions, setDropdownOptions] = useState<DropdownItem[] | undefined>();
    const [NoAffiliation, setNoAffiliation] = useState<boolean>(false);

    let formikJsonPath: string = '';
    field.jsonPath.split('][').forEach(pathSegment => {
        const localPathSegment = pathSegment.replaceAll(/[^a-zA-Z0-9:_@-]/g, '');

        if (Number.isNaN(Number(localPathSegment))) {
            formikJsonPath = formikJsonPath.concat(`['${localPathSegment}']`);
        } else {
            formikJsonPath = formikJsonPath.concat(`[${localPathSegment}]`);
        }
    });

    /* Determine variant */
    const variant: Color = getColor(globalThis.location) as Color;
    const rawRorValue = jp.value(values, field.jsonPath);
    const currentRorIdentifier = (typeof rawRorValue === 'object' && rawRorValue !== null
        ? rawRorValue['schema:identifier']
        : undefined) as string | undefined;
    const currentRorName = (typeof rawRorValue === 'object' && rawRorValue !== null
        ? rawRorValue['schema:name']
        : undefined) as string | undefined;
    const currentRorUrl = (typeof rawRorValue === 'object' && rawRorValue !== null
        ? rawRorValue['schema:url']
        : undefined) as string | undefined;
    const noAffiliationJsonPath = "$['schema:person']['schema:noAffiliation']";

    useEffect(() => {
        const explicitNoAffiliation = jp.value(values, noAffiliationJsonPath) === true;
        const isObjectFieldValue = typeof fieldValue === 'object' && fieldValue !== null;
        const normalizedIdentifier = isObjectFieldValue
            ? ((fieldValue['schema:identifier'] ?? fieldValue.identifier) as string | undefined)
            : undefined;
        const normalizedName = isObjectFieldValue
            ? ((fieldValue['schema:name'] ?? fieldValue.name) as string | undefined)
            : undefined;
        const normalizedUrl = isObjectFieldValue
            ? ((fieldValue['schema:url'] ?? fieldValue.url) as string | undefined)
            : undefined;
        const hasIdentifier = typeof normalizedIdentifier === 'string' && normalizedIdentifier.trim() !== '';
        const hasName = typeof normalizedName === 'string' && normalizedName.trim() !== '';
        const hasUrl = typeof normalizedUrl === 'string' && normalizedUrl.trim() !== '';
        const isNoAffiliationValue = isObjectFieldValue && !hasIdentifier && !hasName && !hasUrl;

        setNoAffiliation(explicitNoAffiliation || isNoAffiliationValue);
    }, [fieldValue, noAffiliationJsonPath, values]);

    useEffect(() => {
        if (!currentRorIdentifier || NoAffiliation) {
            return;
        }

        const fallbackLabel = currentRorName
            ? `${currentRorName} - ${currentRorIdentifier}`
            : currentRorIdentifier;

        const fallbackOption: DropdownItem = {
            label: fallbackLabel,
            value: currentRorIdentifier,
            url: currentRorUrl ?? '',
        };

        setDropdownOptions(previous => {
            const options = previous ?? [];
            if (options.some(option => option.value === currentRorIdentifier)) {
                return options;
            }

            return [fallbackOption, ...options];
        });
    }, [NoAffiliation, currentRorIdentifier, currentRorName, currentRorUrl]);
    /**
     * Function to search for RORs and fill the dropdown with options
     */
    const SearchForROR = async () => {
        setLoading(true);

        const rors = await GetRORsByName({ query });

        /* Reset field name */
        SetFieldValue(field.jsonPath.replace('$', ''), '');

        /* Construct dropdown items from ROR */
        const dropdownOptions: DropdownItem[] = [
            {
                label: 'Select an organisation',
                value: '',
                url: ''
            }
        ];

        rors.forEach(ror => {
            let label = ror?.names.find((nameObject: { lang: string, value: string }) => nameObject?.lang === 'en')?.value ?? ror?.names[0].value ?? '';
            if (label !== '')
                label += ' - ' + ror.id;
            dropdownOptions.push({
                label: label,
                value: ror.id,
                url: ror?.links?.find((link: { type: string, value: string }) => link.type === 'website')?.value ?? 'N/A'
            });
        })

        setDropdownOptions(dropdownOptions);
        setLoading(false);
    };

    /* Class Names */
    const formFieldClass = classNames({
        'b-error': (field.required && !isEmpty(values) && !jp.value(values, field.jsonPath)?.['schema:identifier'] && !NoAffiliation)
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
                {(field.required && !isEmpty(values) && isEmpty(jp.value(values, field.jsonPath)?.['schema:identifier']) && !NoAffiliation) &&
                    <Col className="d-flex align-items-center">
                        <p className="fs-5 fs-lg-4 tc-error">
                            This field is required
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
                            Using the ROR lookup will use the identifier and name of the selected organisation
                        </p>
                    </Col>
                </Row>
            </Row>
            <Row className="mt-1">
                <Col xs={{ span: 12 }} lg>
                    <Field name="rorSearch"
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
                        OnClick={() => SearchForROR()}
                    >
                        <p>
                            Search for ROR
                        </p>
                    </Button>
                </Col>
                {globalThis.location.href.includes('/te/') && (
                    <Col xs="auto" lg="auto">
                        <Button type="button"
                            variant={NoAffiliation ? 'primary' : variant}
                            className="fs-5 fs-lg-4 mt-2 mt-lg-0"
                            OnClick={() => {
                                if (NoAffiliation) {
                                    setNoAffiliation(false);
                                    SetFieldValue(noAffiliationJsonPath.replace('$', ''), false);
                                    SetFieldValue(formikJsonPath, '');
                                } else {
                                    setNoAffiliation(true);
                                    SetFieldValue(noAffiliationJsonPath.replace('$', ''), true);
                                    SetFieldValue(formikJsonPath, {
                                        "@type": "schema:Organization",
                                        "schema:identifier": '',
                                        "schema:name": '',
                                        "schema:url": ''
                                    });
                                }
                            }}
                        >
                            <p>
                                {NoAffiliation ? "✓ No affiliation" : "No affiliation"}
                            </p>
                        </Button>
                    </Col>
                )}
            </Row>
            {/* Display ROR selection dropdown if dropdown options is not undefiend */}
            {(dropdownOptions || currentRorIdentifier) &&
                <Row className="mt-2">
                    <Col>
                        <Select
                            options={(dropdownOptions ?? []) as { label: any; value: any; url: any; }[]}
                            value={currentRorIdentifier ? {
                                label: currentRorName ? `${currentRorName} - ${currentRorIdentifier}` : currentRorIdentifier,
                                value: currentRorIdentifier,
                                url: currentRorUrl ?? ''
                            } : undefined}
                            placeholder="Select an option"
                            className={formFieldClass}
                            onChange={(dropdownOption) => {
                                SetFieldValue(noAffiliationJsonPath.replace('$', ''), false);

                                if (dropdownOption?.value === '') {
                                    SetFieldValue(formikJsonPath, '');
                                    setNoAffiliation(false);
                                } else {
                                    SetFieldValue(formikJsonPath, {
                                        "@type": "schema:Organization",
                                        "schema:identifier": dropdownOption?.value,
                                        "schema:name": dropdownOption?.label.split(" - ")[0].trim(),
                                        "schema:url": dropdownOption?.url
                                    });
                                    setNoAffiliation(false);
                                }
                            }}
                        />
                    </Col>
                </Row>
            }
        </div>
    );
};

export default RORField;