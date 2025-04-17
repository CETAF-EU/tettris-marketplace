/* Import Dependencies */
import DatePicker from 'react-datepicker';

/* Import Types */
import { FormField } from "app/Types";


/* Props Type */
type Props = {
    field: FormField,
    fieldValue: Date,
    SetFieldValue: Function
};


/**
 * Component that renders an input field for a date insert
 * @param field The provided form field
 * @param fieldValue The current value of the field in the form state
 * @param SetFieldValue Function to set the value of a field in the form
 * @returns JSX Component
 */
const DateField = (props: Props) => {
    const { field, fieldValue, SetFieldValue } = props;

    /* Base variables */
    const jsonPath = field.jsonPath.replace('$', '');

    return (
        <div>
            <p>
                {field.title}
            </p>
            <DatePicker selected={fieldValue}
                onChange={(date) => SetFieldValue(jsonPath, date)}
                className="w-100 py-1 px-2 br-corner"
                wrapperClassName="w-100"
            />
        </div>
    );
};

export default DateField;