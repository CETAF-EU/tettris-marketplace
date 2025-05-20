/* Import Dependencies */
import classNames from 'classnames';
import { Field } from "formik";
import jp from 'jsonpath'
import { isEmpty } from 'lodash';

/* Import Types */
import { FormField, Dict } from "app/Types";

/* Import Components */
import FormFieldTitle from './FormFieldTitle';


/* Props Type */
type Props = {
    field: FormField,
    values: Dict
};


/**
 * Component that renders an input field for a free text insert
 * @param field The provided form field
 * @param values The current values in the form state
 * @returns JSX Component
 */
const StringField = (props: Props) => {
    const { field, values } = props;

    /* Class Names */
    const formFieldClass = classNames({
        'b-error': (field.required && !isEmpty(values) && !jp.value(values, field.jsonPath))
    });

    return (
        <div>
            <FormFieldTitle field={field}
                values={values}
            />
            <Field name={field.jsonPath.replace('$', '')}
                className={`${formFieldClass} w-100 mt-1 py-1 px-2 br-corner`}
                maxLength={field.maxChars}
            />
        </div>
    );
};

export default StringField;