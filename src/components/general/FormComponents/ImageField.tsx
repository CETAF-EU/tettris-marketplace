import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useField, useFormikContext } from "formik";
import jp from 'jsonpath';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

/* Types */
import { FormField, Dict } from "app/Types";
import FormFieldTitle from './FormFieldTitle';
import { useState } from 'react';
import { Col } from 'react-bootstrap';

type Props = {
    field: FormField;
    values: Dict;
};

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

const ImageField = ({ field, values }: Props) => {
    const { setFieldValue } = useFormikContext();
    const [error, setError] = useState<string | null>(null);
    const [formikField] = useField(field.jsonPath.replace('$', ''));

    const fieldValue = jp.value(values, field.jsonPath);
    const isRequiredAndEmpty = field.required && (!fieldValue || typeof fieldValue !== 'string');
    const currentImageSrc = typeof fieldValue === 'string' && fieldValue.trim() !== '' ? fieldValue : null;

    const formFieldClass = classNames({
        'b-error': isRequiredAndEmpty || error,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.currentTarget.files?.[0];
        if (file) {
            if (file.size > MAX_SIZE) {
                setError('File size exceeds 2 MB');
                return;
            }
            setError(null); // Clear previous error
            const reader = new FileReader();
            reader.onloadend = () => {
                setFieldValue(formikField.name, reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setFieldValue(formikField.name, '');
        setError(null);
    };

    return (
        <div>
            <FormFieldTitle field={field} values={values} />
            {currentImageSrc && (
                <div className="mt-2 mb-2">
                    <img
                        src={currentImageSrc}
                        alt="Current profile"
                        style={{ maxWidth: '12rem', maxHeight: '12rem', objectFit: 'contain' }}
                    />
                    <div className="mt-2">
                        <button
                            type="button"
                            className="btn btn-link p-0"
                            onClick={handleRemoveImage}
                            aria-label="Remove image"
                        >
                            <FontAwesomeIcon icon={faTrashCan} size="lg" />
                        </button>
                    </div>
                </div>
            )}
            <input
                name={formikField.name}
                type="file"
                accept="image/*"
                className={`${formFieldClass} w-100 mt-1 py-1 px-2 br-corner`}
                onChange={handleFileChange}
            />

            {(isRequiredAndEmpty || error) && (
                <Col className="d-flex align-items-center">
                    <p className="fs-5 fs-lg-4 tc-error mb-0">
                        {error ?? "This field is required"}
                    </p>
                </Col>
            )}
        </div>
    );
};

export default ImageField;