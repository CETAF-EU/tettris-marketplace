/* Import Dependencies */
import { Field } from "formik";

/* Import Types */
import { FormField } from "app/Types";


/* Props Type */
type Props = {
    field: FormField,
};


/**
 * Component that renders a hidden field for injecting hidden values into the form
 * @param field The provided form field
 * @returns JSX Component
 */
const HiddenField = (props: Props) => {
    const { field } = props;

    return (
        <Field name={field.jsonPath.replace('$', '')}
            type="hidden"
            value={field.const}
            const={field.const}
        />
    );
};

export default HiddenField;