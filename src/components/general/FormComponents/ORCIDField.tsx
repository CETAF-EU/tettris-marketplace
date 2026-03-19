/* Import Dependencies */
import classNames from 'classnames';
import { Field } from "formik";
import jp from 'jsonpath';
import { isEmpty } from "lodash";
import { useEffect, useRef, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import Select from "react-select";

/* Import Types */
import { FormField, Dict, DropdownItem } from "app/Types";

/* Import API */
import { GetOrcidByName } from 'api/orcid/GetOrcidByName';
import { getOrcidById } from 'api/orcid/GetOrcidById';

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
    const [noOrcid, setNoOrcid] = useState<boolean>(false);
    const lastResolvedOrcidRef = useRef<string | null>(null);

    let formikJsonPath: string = '';
    field.jsonPath.split('][').forEach(pathSegment => {
        const localPathSegment = pathSegment.replaceAll(/[^a-zA-Z0-9:_@-]/g, '');

        if (Number.isNaN(Number(localPathSegment))) {
            formikJsonPath = formikJsonPath.concat(`['${localPathSegment}']`);
        } else {
            formikJsonPath = formikJsonPath.concat(`[${localPathSegment}]`);
        }
    });

    const noOrcidJsonPath = "$['schema:person']['schema:noOrcid']";
    const currentOrcid = (jp.value(values, field.jsonPath) as string | undefined)
        ?? (typeof fieldValue?.['schema:identifier'] === 'string' ? fieldValue['schema:identifier'] : undefined);
    /* Determine variant */
    const variant: Color = getColor(globalThis.location) as Color;
    /**
     * Function to search for RORs and fill the dropdown with options
     */

    useEffect(() => {
        setNoOrcid(jp.value(values, noOrcidJsonPath) === true);
    }, [values]);

    useEffect(() => {
        if (!currentOrcid || noOrcid) {
            return;
        }

        const fallbackOption: DropdownItem = {
            label: currentOrcid,
            value: currentOrcid,
            url: `https://orcid.org/${currentOrcid}`,
        };

        setDropdownOptions(previous => {
            const existingOptions = previous ?? [];
            if (existingOptions.some(option => option.value === currentOrcid)) {
                return existingOptions;
            }
            return [fallbackOption, ...existingOptions];
        });

        if (lastResolvedOrcidRef.current === currentOrcid) {
            return;
        }

        lastResolvedOrcidRef.current = currentOrcid;

        let isDisposed = false;

        getOrcidById(currentOrcid).then(orcidData => {
            if (!orcidData || isDisposed) {
                return;
            }

            const resolvedOption: DropdownItem = {
                label: orcidData.name,
                value: orcidData.orcid,
                url: `https://orcid.org/${orcidData.orcid}`,
            };

            setDropdownOptions(previous => {
                const resolvedOptions: DropdownItem[] = [];
                const existingOptions = previous ?? [];

                for (const option of existingOptions) {
                    if (option.value !== currentOrcid) {
                        resolvedOptions.push(option);
                    }
                }

                return [resolvedOption, ...resolvedOptions];
            });
        });

        return () => {
            isDisposed = true;
        };
    }, [currentOrcid, noOrcid]);

    const validateOrcid = async (orcid: string) => {
        if (noOrcid) {
            setOrcidExists(false);
            SetFieldValue(formikJsonPath, '');
            SetFieldValue(noOrcidJsonPath.replace('$', ''), true);
            return;
        }

        if (typeof orcid === 'string' && orcid.trim() !== '') {
            const normalizedSelectedOrcid = orcid.trim().toUpperCase();
            const normalizedCurrentOrcid = (currentOrcid ?? '').trim().toUpperCase();

            if (normalizedCurrentOrcid && normalizedSelectedOrcid === normalizedCurrentOrcid) {
                setOrcidExists(false);
                SetFieldValue(formikJsonPath, orcid.trim());
                SetFieldValue(noOrcidJsonPath.replace('$', ''), false);
                return;
            }

            const exists = globalThis.location.href.includes('/ts/') ? null : await checkIfOrcidExists(orcid.trim());
            if (exists === null) {
                setOrcidExists(false);
                SetFieldValue(formikJsonPath, orcid.trim());
                SetFieldValue(noOrcidJsonPath.replace('$', ''), false);
            } else {
                setOrcidExists(true);
                SetFieldValue(formikJsonPath, '');
            }
        } else {
            setOrcidExists(false);
            SetFieldValue(formikJsonPath, '');
            SetFieldValue(noOrcidJsonPath.replace('$', ''), false);
        }
    };

const SearchForOrcid = async () => {
    setLoading(true);

    try {
        const orcids = await GetOrcidByName(query);

        // Build dropdown options
        const dropdownOptions: DropdownItem[] = [
            {
                label: 'Select an organisation',
                value: '',
                url: '',
            }
        ];

        orcids.forEach(orcid => {
            dropdownOptions.push({
                label: orcid?.name,
                value: orcid?.identifier,
                url: `https://orcid.org/${orcid?.identifier}`,
            });
        });

        setDropdownOptions(dropdownOptions);
    } catch (error) {
        console.error("ORCID search failed:", error);
    } finally {
        setLoading(false);
    }
};

    /* Class Names */
    const formFieldClass = classNames({
        'b-error': (
            (field.required && !isEmpty(values) &&
                (typeof jp.value(values, field.jsonPath) !== 'string' ||
                isEmpty(jp.value(values, field.jsonPath))) && !noOrcid)
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
                {((field.required && !isEmpty(values) && (typeof jp.value(values, field.jsonPath) !== 'string' || isEmpty(jp.value(values, field.jsonPath))) && !noOrcid) || orcidExists) &&
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
                {globalThis.location.href.includes('/te/') && (
                    <Col xs="auto" lg="auto">
                        <Button type="button"
                            variant={noOrcid ? 'primary' : variant}
                            className="fs-5 fs-lg-4 mt-2 mt-lg-0"
                            OnClick={() => {
                                const nextValue = !noOrcid;

                                setNoOrcid(nextValue);
                                setOrcidExists(false);
                                SetFieldValue(noOrcidJsonPath.replace('$', ''), nextValue);

                                if (nextValue) {
                                    SetFieldValue(formikJsonPath, '');
                                }
                            }}
                        >
                            <p>
                                {noOrcid ? '✓ No ORCID' : 'No ORCID'}
                            </p>
                        </Button>
                    </Col>
                )}
            </Row>
            {/* Display ROR selection dropdown if dropdown options is not undefiend */}
            {dropdownOptions &&
                <Row className="mt-2">
                    <Col>
                        <Select
                            options={dropdownOptions as { label: any; value: any; url: any; }[]}
                            value={
                                currentOrcid
                                    ? (dropdownOptions.find(option => option.value === currentOrcid) ?? {
                                        label: currentOrcid,
                                        value: currentOrcid,
                                        url: `https://orcid.org/${currentOrcid}`,
                                    })
                                    : undefined
                            }
                            placeholder="Select an option"
                            className={formFieldClass}
                            onChange={(dropdownOption) => {
                                setNoOrcid(false);
                                SetFieldValue(noOrcidJsonPath.replace('$', ''), false);
                                validateOrcid(dropdownOption?.value ?? '')
                            }}
                        />
                    </Col>
                </Row>
            }
        </div>
    );
};

export default ORCIDField;