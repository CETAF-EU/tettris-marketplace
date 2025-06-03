/* Import Dependencies */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Formik, Form, FormikProps } from 'formik';
import { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';

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
    ToggleFilters?: Function
};

/** Component that renders the Filters Bar on the Search page */
const FiltersBar = (props: Props) => {
    const { ToggleFilters } = props;

    /* Hooks */
    const [searchParams, setSearchParams] = useSearchParams();

    /* State */
    const [currentServiceType, setCurrentServiceType] = useState(searchParams.get('serviceType') ?? '');
    const [initialValues, setInitialValues] = useState<Dict>({});

    /* Base variables */
    const FiltersType: FilterType[] = import.meta.env.VITE_DEV === 'true' ? [...DevFilters.filters] : [...Filters.filters];
    const taxonomicServicefilters: FilterType[] = [...TaxonomicServiceFilters.taxonomicServiceFilters];
    const taxonomicExpertFilters: FilterType[] = TaxonimicExpertFilters.taxonomicExpertFilters.map(filter => ({
        ...filter,
        options: filter.options.map(option => ({
            ...option,
            value: option.value ?? ''
        }))
    }));

    /* Determine filters based on service type */
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

        /* Set initial values */
        filters.unshift(...FiltersType);
        FiltersType.forEach((filter) => {
            initialValues[filter.name] = searchParams.get(filter.name) ?? filter.default;
        });

        return { filters, hint };
    };

    const { filters, hint } = determineFilters();

    /* Effect to track serviceType changes in URL */
    useEffect(() => {
        const newServiceType = searchParams.get('serviceType') ?? '';
        if (newServiceType !== currentServiceType) {
            setCurrentServiceType(newServiceType);
        }
    }, [searchParams]);

    /**
     * Function that resets all search filters, except for taxonomic service type
     */
    const ResetSearchFilters = () => {
        const serviceTypeValue = searchParams.get('serviceType');
        filters.forEach(filter => {
            if (filter.name === 'serviceType') {
                initialValues[filter.name] = serviceTypeValue ?? filter.default ?? '';
            } else {
                searchParams.delete(filter.name);
                initialValues[filter.name] = filter.default ?? '';
            }
        });
        searchParams.delete('query');
        initialValues['query'] = '';
        setSearchParams(searchParams);
        setInitialValues({ ...initialValues });
    };

    /* Class Names */
    const serviceTypeClass = classNames({
        'tr-smooth': true,
        'tc-primary': !searchParams.get('serviceType'),
        'tc-secondary': searchParams.get('serviceType') === 'referenceCollection',
        'tc-tertiary': searchParams.get('serviceType') === 'taxonomicExpert'
    });
    const variant: Color = getColor(window.location) as Color;

    /* Formik content component */
    const FormikContent = ({ values, setFieldValue, submitForm }: FormikProps<any>) => {
        /* Effect to reset filters when serviceType changes */
        useEffect(() => {
            if (values.serviceType !== currentServiceType) {
                // Reset all other filters to their defaults
                filters.forEach(filter => {
                    if (filter.name !== 'serviceType' && filter.default !== undefined) {
                        setFieldValue(filter.name, filter.default);
                        searchParams.delete(filter.name);
                    }
                });
                
                // Update current serviceType
                setCurrentServiceType(values.serviceType);
                
                // Update URL params immediately
                setSearchParams(searchParams);
            }
        }, [values.serviceType]);

        return (
            <Form translate="no">
                <Row className="align-items-end">
                    {/* Search Bar */}
                    <Col 
                        xs={12} 
                        lg={filters.length > 4 ? 2 : 4} 
                        className="mb-4 mb-lg-0"
                    >
                        <p className={`${serviceTypeClass} fs-5 fw-lightBold`}>Search query</p>
                        <QueryBar name="query" placeholder={hint}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </QueryBar>
                    </Col>
            
                    {/* Filters */}
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
            
                    {/* Search button */}
                    <Col lg="auto" className="d-none d-lg-block">
                        <Button type="submit" variant={variant}>
                            <p>Search</p>
                        </Button>
                    </Col>
            
                    {/* Deselect all filters button */}
                    <Col lg="auto" className="ps-0 d-none d-lg-block">
                        <Button 
                            type="button"
                            variant="primary"
                            className="bgc-error"
                            OnClick={() => ResetSearchFilters()}
                        >
                            <FontAwesomeIcon icon={faFilterCircleXmark} size="lg" />
                        </Button>
                    </Col>
                </Row>
            </Form>                
        );
    };

    return (
        <Formik 
            initialValues={{
                query: searchParams.get('query') ?? '',
                ...initialValues
            }}
            enableReinitialize={true}
            onSubmit={async (values) => {
                await new Promise((resolve) => setTimeout(resolve, 100));

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
            {FormikContent}
        </Formik>
    );
}

export default FiltersBar;