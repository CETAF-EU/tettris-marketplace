/* Import Dependencies */
import classNames from 'classnames';
import jp from 'jsonpath'
import { isEmpty } from 'lodash';
import Select from "react-select";

/* Import Types */
import { FormField, Dict, DropdownItem } from "app/Types";

/* Import Components */
import FormFieldTitle from './FormFieldTitle';


/* Props Type */
type Props = {
    field: FormField,
    values: Dict
    SetFieldValue: Function,
    SetServiceTypes?: Function
};


/**
 * Component that renders a select field for multi selection
 * @param field The provided form field
 * @param values The current values object of the form
 * @param SetFieldValue Function to set the value of a field in the form
 * @param SetServiceTypes Function to set the service types state
 * @returns JSX Component
 */
const MultiSelectField = (props: Props) => {
    const { field, values, SetFieldValue, SetServiceTypes } = props;

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
            <Select
                placeholder="Select an option"
                options={selectItems}
                isMulti={true}
                className={`${formFieldClass} mt-2`}
                onChange={(dropdownOptions) => {
                    // Remove the first option if the max selections is reached
                    if (field.maxSelections && dropdownOptions.length > field.maxSelections) {
                        (dropdownOptions as Array<DropdownItem>).shift();
                    }
                    /* Create array of all dropdown options values */
                    const valuesArray: string[] = [];

                    dropdownOptions.forEach(dropdownOption => {
                        valuesArray.push(dropdownOption.value);
                    });

                    SetFieldValue(jsonPath, valuesArray);
                    SetServiceTypes?.(valuesArray);
                }}
            />
        </div>
    );
};

export default MultiSelectField;