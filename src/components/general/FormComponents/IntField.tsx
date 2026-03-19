/* Import Dependencies */
import classNames from 'classnames';
import { Field, useFormikContext } from "formik";
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
 * Component that renders an input field for integer values
 * @param field The provided form field
 * @param values The current values in the form state
 * @returns JSX Component
 */
const IntField = (props: Props) => {
    const { field, values } = props;
    const { setFieldValue } = useFormikContext<Dict>();

    const fieldName = field.jsonPath.replace('$', '');

    /* Class Names */
    const formFieldClass = classNames({
        'b-error': (field.required && !isEmpty(values) && (jp.value(values, field.jsonPath) === '' || jp.value(values, field.jsonPath) === undefined || jp.value(values, field.jsonPath) === null))
    });

    return (
        <div>
            <FormFieldTitle field={field}
                values={values}
            />
            <Field name={fieldName}>
                {({ field: formikField }: { field: { value: number | string | undefined; name: string } }) => (
                    <input
                        name={formikField.name}
                        type="number"
                        min={0}
                        step={1}
                        inputMode="numeric"
                        className={`${formFieldClass} w-100 mt-1 py-1 px-2 br-corner`}
                        value={formikField.value ?? ''}
                        onKeyDown={(event) => {
                            const allowedControlKeys = [
                                'Backspace',
                                'Delete',
                                'Tab',
                                'ArrowLeft',
                                'ArrowRight',
                                'Home',
                                'End'
                            ];

                            if (allowedControlKeys.includes(event.key)) {
                                return;
                            }

                            if (!/^\d$/.test(event.key)) {
                                event.preventDefault();
                            }
                        }}
                        onPaste={(event) => {
                            const pastedText = event.clipboardData.getData('text');
                            if (!/^\d*$/.test(pastedText)) {
                                event.preventDefault();
                            }
                        }}
                        onChange={(event) => {
                            const rawValue = event.currentTarget.value;

                            if (rawValue === '') {
                                setFieldValue(fieldName, '');
                                return;
                            }

                            if (/^\d+$/.test(rawValue)) {
                                setFieldValue(fieldName, rawValue);
                            }
                        }}
                    />
                )}
            </Field>
        </div>
    );
};

export default IntField;
