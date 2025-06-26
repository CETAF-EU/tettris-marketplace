/* Import Dependencies */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Formik, Form } from 'formik';
import { useMemo, useState } from 'react';
import { Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';

/* Import Hooks */
import { useSearchParams } from 'react-router-dom';

/* Import Types */
import { Dict, Filter as FilterType } from 'app/Types';

/* Import Sources */
import Filters from 'sources/searchFilters/Filters.json';
import DevFilters from 'sources/searchFilters/DevFilters.json';
import TaxonomicServiceFilters from 'sources/searchFilters/TaxonomicServiceFilters.json';
import TaxonimicExpertFilters from 'sources/searchFilters/TaxonomicExpertFilters.json';

/* Import Icons */
import { faMagnifyingGlass, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';

/* Import Components */
import Filter from './Filter';
import { QueryBar } from 'components/general/FormComponents';
import { Button } from 'components/general/CustomComponents';
import { Color, getColor } from 'components/general/ColorPage';

/* Props Type */
type Props = {
    ToggleFilters?: Function;
};

const FiltersBar = ({ ToggleFilters }: Props) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentServiceType, setCurrentServiceType] = useState(searchParams.get('serviceType') ?? '');

    const FiltersType: FilterType[] = import.meta.env.VITE_DEV === 'true' ? [...DevFilters.filters] : [...Filters.filters];
    const taxonomicServicefilters: FilterType[] = [...TaxonomicServiceFilters.taxonomicServiceFilters];
    const taxonomicExpertFilters: FilterType[] = TaxonimicExpertFilters.taxonomicExpertFilters.map(filter => ({
        ...filter,
        options: filter.options.map(option => ({
        ...option,
        value: option.value ?? ''
        }))
    }));

    // Check if the serviceType in searchParams has changed
    const newServiceType = searchParams.get('serviceType') ?? '';
    if (newServiceType !== currentServiceType) {
        // Clear all filters except serviceType and query when service type changes
        const newParams = new URLSearchParams();
        const serviceType = searchParams.get('serviceType');
        if (serviceType) newParams.set('serviceType', serviceType);
        setSearchParams(newParams);
        setCurrentServiceType(newServiceType);
    }

    const determineFilters = (): { filters: FilterType[], hint: string } => {
        const filters: FilterType[] = [];
        const serviceType = searchParams.get('serviceType');
        let hint = "pollinator academy";

        if (!serviceType) {
        filters.push(...taxonomicServicefilters);
        } else if (serviceType === 'taxonomicExpert') {
        let subGroup = "";
        if (searchParams.get('taxonomicGroup')) {
            subGroup = "sub" + (searchParams.get('taxonomicGroup') as string).charAt(0).toUpperCase() +
            (searchParams.get('taxonomicGroup') as string).slice(1) + "Group";
        }

        let i = 0;
        while (i < taxonomicExpertFilters.length) {
            const filter = taxonomicExpertFilters[i];

            if (filter.name == "taxonomicGroup") {
            filters.push(filter);
            i++;

            if (searchParams.get('taxonomicGroup')) {
                while (i < taxonomicExpertFilters.length && !taxonomicExpertFilters[i].name.includes(subGroup)) {
                i++;
                }
                filters.push(taxonomicExpertFilters[i++]);

                while (i < taxonomicExpertFilters.length && taxonomicExpertFilters[i].name.includes('sub')) {
                i++;
                }
            } else {
                filters.push(taxonomicExpertFilters[i++]);
                while (i < taxonomicExpertFilters.length && taxonomicExpertFilters[i].name.includes('sub')) {
                i++;
                }
            }
            } else {
            filters.push(filter);
            i++;
            }
        }
        hint = "John Doe";
        }
        filters.unshift(...FiltersType);
        return { filters, hint };
    };

    const { filters, hint } = useMemo(() => determineFilters(), [searchParams.toString()]);

    const initialValues = useMemo(() => {
        const values: Dict = { query: searchParams.get('query') ?? '' };
        filters.forEach((filter) => {
        values[filter.name] = searchParams.get(filter.name) ?? filter.default ?? '';
        });
        return values;
    }, [searchParams.toString(), filters]);

    const ResetSearchFilters = (resetForm: Function) => {
        const newValues: Dict = {};
        filters.forEach(filter => {
        if (filter.name === 'serviceType') return; // don't reset serviceType
        searchParams.delete(filter.name);
        newValues[filter.name] = filter.default ?? '';
        });
        searchParams.delete('query');
        newValues['query'] = '';
        setSearchParams(searchParams);
        resetForm({ values: { ...initialValues, ...newValues } });
    };

    const serviceTypeClass = classNames({
        'tr-smooth': true,
        'tc-primary': !searchParams.get('serviceType'),
        'tc-secondary': searchParams.get('serviceType') === 'referenceCollection',
        'tc-tertiary': searchParams.get('serviceType') === 'taxonomicExpert'
    });

    const variant: Color = getColor(window.location) as Color;

    return (
        <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={async (values) => {
            Object.entries(values).forEach(([key, value]) => {
            searchParams.delete(key);
            if (value && value !== 'taxonomicService') {
                searchParams.set(key, value);
            }
            });
            setSearchParams(searchParams);
            ToggleFilters?.();
        }}
        >
        {({ values, setFieldValue, submitForm, resetForm }) => (
            <Form translate="no">
            <Row className="align-items-end">
                <Col xs={12} lg={filters.length > 4 ? 2 : 4} className="mb-4 mb-lg-0">
                    <div className="d-flex align-items-center">
                        <p className={`${serviceTypeClass} fs-5 fw-lightBold me-2`}>Search query</p>
                        <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={
                                <Tooltip id="search-tooltip">
                                    You can use wildcards (*), fuzzy search (~), or both (e.g., <code>mat*eo~</code>)
                                </Tooltip>
                            }
                        >
                            <span style={{ cursor: 'pointer' }} className={`fs-5 fw-bold tc-${variant}`}>?</span>
                        </OverlayTrigger>
                    </div>
                    <QueryBar name="query" placeholder={hint}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </QueryBar>
                </Col>
                <Col>
                <Row>
                    {filters.map((filter) => (
                    <Col
                        key={filter.name}
                        xs={12}
                        lg={filters.length > 4 ? Math.max(3 / filters.length, 2) : 3}
                        className="mb-2 mb-lg-0"
                    >
                        <Filter
                        filter={filter}
                        currentValue={values[filter.name as keyof typeof values]}
                        hasDefault={!!filters.find(originalFilter => originalFilter.name === filter.name)?.default}
                        SetFilterValue={(value: string | number | boolean) => setFieldValue(filter.name, value)}
                        SubmitForm={() => submitForm()}
                        />
                    </Col>
                    ))}
                </Row>
                </Col>
                <Col lg="auto" className="d-none d-lg-block">
                <Button type="submit" variant={variant}>
                    <p>Search</p>
                </Button>
                </Col>
                <Col lg="auto" className="ps-0 d-none d-lg-block">
                    <OverlayTrigger
                        placement="top"
                        delay={{ show: 250, hide: 400 }}
                        overlay={<Tooltip id="reset-tooltip">Reset all filters</Tooltip>}
                    >
                        <span className="d-inline-block" style={{ pointerEvents: 'auto' }}>
                            <Button
                                type="button"
                                variant="primary"
                                className="bgc-error"
                                OnClick={() => ResetSearchFilters(resetForm)}
                            >
                                <FontAwesomeIcon icon={faFilterCircleXmark} size="lg" />
                            </Button>
                        </span>
                    </OverlayTrigger>
                </Col>
            </Row>
            </Form>
        )}
        </Formik>
    );
};

export default FiltersBar;
