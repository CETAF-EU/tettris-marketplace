/* Import Dependencies */
import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';

/* Import Types */
import { Filter as FilterType, DropdownItem } from "app/Types";

/* Import Utilities */
import { MakeReadableString } from 'app/Utilities';

/* Import Components */
import { Dropdown, DatePicker, QueryBar } from 'components/general/FormComponents';
import { getColor } from 'components/general/ColorPage';

/* Props Type */
type Props = {
    filter: FilterType,
    currentValue?: string | number | boolean | Date,
    hasDefault?: boolean,
    SetFilterValue: Function,
    SubmitForm: Function
};


/** Component that renders a filter based upon the provided filter type
    * @param filter The filter object holding a name, type and possible other properties
    * @param currentValue The current value chosen for the filter
    * @param SetFilterValue Function to set the filter value when changed
    * @param SubmitForm Function to submit the form
*/
const Filter = (props: Props) => {
    const { filter, currentValue, hasDefault, SetFilterValue, SubmitForm } = props;

    /* Hooks */
    const [searchParams] = useSearchParams();

    /* Class Names */
    const serviceTypeClass = classNames({
        'tr-smooth': true,
        'tc-primary': !searchParams.get('serviceType'),
        'tc-secondary': searchParams.get('serviceType') === 'referenceCollection',
        'tc-tertiary': searchParams.get('serviceType') === 'taxonomicExpert'

    });

    /* Base variables */
    const dropDowncolor = getColor(window.location, true)
    switch (filter.type) {
        case 'select':
            if (filter.options) {
                const selectedOption: DropdownItem | undefined = filter.options.find((option) => option.value === currentValue) as DropdownItem;

                return <>
                    <p className={`${serviceTypeClass} fs-5 fw-lightBold`}>{MakeReadableString(filter.name)}</p>
                    <Dropdown items={filter.options}
                        selectedItem={currentValue ? {
                            label: MakeReadableString(selectedOption?.label ?? `${currentValue}`),
                            value: `${currentValue}`,
                        } : undefined}
                        placeholder={MakeReadableString(filter.name)}
                        hasDefault={hasDefault}
                        styles={{
                            color: dropDowncolor
                        }}
                        OnChange={(item: DropdownItem) => {
                            SetFilterValue(item.value);
                            SubmitForm();
                        }}
                    />
                </>;
            }
            return <> </>;
        case 'date':
            return <>
                <p className={`${serviceTypeClass} fs-5 fw-lightBold`}>{MakeReadableString(filter.name)}</p>
                <DatePicker selected={currentValue instanceof Date ? currentValue : undefined}
                    placeholder="Publishing date"
                    OnChange={(date: Date) => SetFilterValue(date)}
                />
            </>;
        default:
            return <>
                <p className={`${serviceTypeClass} fs-5 fw-lightBold`}>{MakeReadableString(filter.name)}</p>
                <QueryBar name={filter.name}
                    placeholder={MakeReadableString(filter.placeholder ?? filter.name)}
                />
            </>;
    }
}

export default Filter;