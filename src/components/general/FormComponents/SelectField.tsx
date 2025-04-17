/* Import Dependencies */
import classNames from 'classnames';
import jp from 'jsonpath';
import { isEmpty } from 'lodash';
import Select from "react-select";

/* Import Types */
import { Dict, FormField } from "app/Types";

/* Import Sources */
import SPDXLicenses from 'sources/spdxLicenses/SPDXLicenses.json';

/* Import Components */
import FormFieldTitle from './FormFieldTitle';


/* Props Type */
type Props = {
    field: FormField,
    values: Dict,
    SetFieldValue: Function
};


/**
 * Component that renders a select field for single selection
 * @param field The provided form field
 * @param values The current values in the form state
 * @param SetFieldValue Function to set the value of a field in the form
 * @returns JSX Component
 */
const SelectField = (props: Props) => {
    const { field, values, SetFieldValue } = props;

    /* Base variables */
    const jsonPath = field.jsonPath.replace('$', '');
    const selectItems: {
        label: string,
        value: string
    }[] = [];

    /* Construct select items */
    field.options?.forEach(option => {
        /* Define label */
        let label: string = '';

        if (field.mapping) {
            if (typeof (field.mapping) === 'object') {
                label = field.mapping[option]
            } else if (field.mapping === 'licenses') {
                label = SPDXLicenses.licenses.find(license => license.detailsUrl === option)?.name ?? option;
            }
        } else {
            label = option;
        }

        selectItems.push({
            label,
            value: option
        });
    });

    /* Class Names */
    const formFieldClass = classNames({
        'b-error': (field.required && !isEmpty(values) && isEmpty(jp.value(values, field.jsonPath)))
    });

    return (
        <div>
            <FormFieldTitle field={field}
                values={values}
            />
            <Select placeholder="Select an option"
                options={selectItems.toSorted((a, b) => a.label > b.label ? 1 : 0)}
                className={`${formFieldClass} mt-1`}
                onChange={(dropdownOption) => SetFieldValue(jsonPath, dropdownOption?.value)}
            />
        </div>
    );
};

export default SelectField;