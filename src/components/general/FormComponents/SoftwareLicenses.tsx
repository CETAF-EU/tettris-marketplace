/* Import Dependencies */
import Select from "react-select";

/* Import Types */
import { FormField } from "app/Types";

/* Import Sources */
import SPDXLicenses from 'sources/spdxLicenses/SPDXLicenses.json';


/* Props Type */
type Props = {
    field: FormField,
    SetFieldValue: Function
};


/**
 * Component that renders a select field for software licenses
 * @param field The provided form field
 * @param SetFieldValue Function to set the value of a field in the form
 * @returns JSX Component
 */
const SoftwareLicenses = (props: Props) => {
    const { field, SetFieldValue } = props;

    /* Base variables */
    const jsonPath = field.jsonPath.replace('$', '');
    const selectItems: {
        label: string,
        value: string
    }[] = [];

    /* Construct select items by querying the SPDX source file */
    SPDXLicenses.licenses?.forEach(license => {
        selectItems.push({
            label: license.name,
            value: license.detailsUrl
        });
    });

    return (
        <div>
            <p>
                {field.title}{field.required ? <span className="tc-grey"> *</span> : ''}
            </p>
            <p className="fs-5 tc-grey">
                {field.description}
            </p>
            <Select
                placeholder="Select an option"
                options={selectItems.toSorted((a, b) => a.label > b.label ? 1 : 0)}
                onChange={(dropdownOption) => SetFieldValue(jsonPath, dropdownOption?.value)}
            />
        </div>
    );
};

export default SoftwareLicenses;