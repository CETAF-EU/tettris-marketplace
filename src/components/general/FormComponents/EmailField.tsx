import classNames from 'classnames';
import { Field } from "formik";
import jp from 'jsonpath';
import { isEmpty } from 'lodash';
import { useEffect, useRef, useState, type ChangeEvent, type FocusEvent } from 'react';

import { FormField, Dict } from "app/Types";
import checkIfEmailExists from 'api/email/checkIfEmailExists';
import FormFieldTitle from './FormFieldTitle';

type Props = {
    field: FormField,
    values: Dict,
    SetFieldValue: Function,
    currentExpertId?: string,
    lockedEmail?: string
};

const EmailField = (props: Props) => {
    const { field, values, SetFieldValue, currentExpertId, lockedEmail } = props;

    const emailValue = (jp.value(values, field.jsonPath) as string | undefined) ?? '';
    const confirmationJsonPath = field.confirmationJsonPath;
    const confirmationValue = confirmationJsonPath
        ? ((jp.value(values, confirmationJsonPath) as string | undefined) ?? '')
        : '';
    const requiresManualConfirmation = !lockedEmail && !currentExpertId;
    const [emailExists, setEmailExists] = useState<boolean>(false);
    const [checkingEmail, setCheckingEmail] = useState<boolean>(false);
    const latestRequestRef = useRef(0);

    useEffect(() => {
        if (lockedEmail && emailValue !== lockedEmail) {
            SetFieldValue(field.jsonPath.replace('$', ''), lockedEmail);
        }
    }, [emailValue, field.jsonPath, lockedEmail, SetFieldValue]);

    const emailsMismatch = requiresManualConfirmation
        && !!emailValue
        && !!confirmationValue
        && emailValue.trim().toLowerCase() !== confirmationValue.trim().toLowerCase();

    const validateEmailAvailability = async (rawEmail: string) => {
        const normalizedEmail = rawEmail.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!requiresManualConfirmation || !normalizedEmail || !emailRegex.test(normalizedEmail)) {
            setEmailExists(false);
            return;
        }

        const requestId = latestRequestRef.current + 1;
        latestRequestRef.current = requestId;
        setCheckingEmail(true);

        try {
            const existingExpert = await checkIfEmailExists(normalizedEmail);
            if (latestRequestRef.current !== requestId) {
                return;
            }

            const existingExpertId = existingExpert?.taxonomicExpert?.['@id'];
            setEmailExists(Boolean(existingExpertId && existingExpertId !== currentExpertId));
        } finally {
            if (latestRequestRef.current === requestId) {
                setCheckingEmail(false);
            }
        }
    };

    const formFieldClass = classNames({
        'b-error': (
            (field.required && !isEmpty(values) && !emailValue)
            || emailExists
            || emailsMismatch
        )
    });

    const confirmationFieldClass = classNames({
        'b-error': (
            requiresManualConfirmation
            && !isEmpty(values)
            && ((!confirmationValue && !!emailValue) || emailsMismatch)
        )
    });

    return (
        <div>
            <FormFieldTitle field={field}
                values={values}
            />
            {lockedEmail && (
                <p className="mt-1 fs-5 tc-grey">
                    Retrieved from your ORCID account.
                </p>
            )}
            {emailExists && (
                <p className="mt-1 fs-5 tc-error">
                    This email address already exists in the database
                </p>
            )}
            {emailsMismatch && (
                <p className="mt-1 fs-5 tc-error">
                    Email addresses do not match
                </p>
            )}
            {checkingEmail && (
                <p className="mt-1 fs-5 tc-grey">
                    Checking email availability...
                </p>
            )}
            <Field name={field.jsonPath.replace('$', '')}
                type="email"
                className={`${formFieldClass} w-100 mt-1 py-1 px-2 br-corner`}
                value={emailValue}
                readOnly={Boolean(lockedEmail)}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    SetFieldValue(field.jsonPath.replace('$', ''), event.target.value);
                    if (emailExists) {
                        setEmailExists(false);
                    }
                }}
                onBlur={(event: FocusEvent<HTMLInputElement>) => {
                    validateEmailAvailability(event.target.value);
                }}
            />
            {requiresManualConfirmation && confirmationJsonPath && (
                <div className="mt-3">
                    <p>Confirm Email</p>
                    <p className="mt-1 fs-5 tc-grey">
                        Re-enter your email address to confirm it.
                    </p>
                    <Field name={confirmationJsonPath.replace('$', '')}
                        type="email"
                        className={`${confirmationFieldClass} w-100 mt-1 py-1 px-2 br-corner`}
                        value={confirmationValue}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            SetFieldValue(confirmationJsonPath.replace('$', ''), event.target.value);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default EmailField;
