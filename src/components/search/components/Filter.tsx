import classNames from "classnames";
import { useSearchParams } from "react-router-dom";

/* Import Types */
import { Filter as FilterType, DropdownItem } from "app/Types";

/* Import Utilities */
import { MakeReadableString } from "app/Utilities";

/* Import Components */
import { Dropdown, DatePicker, QueryBar } from "components/general/FormComponents";
import { getColor } from "components/general/ColorPage";

/* Props Type */
type Props = {
	filter: FilterType;
	currentValue?: string | number | boolean | Date;
	hasDefault?: boolean;
	SetFilterValue: Function;
	SubmitForm: Function;
};

const Filter = ({ filter, currentValue, hasDefault, SetFilterValue, SubmitForm }: Props) => {
	const [searchParams] = useSearchParams();
	const dropDownColor = getColor(window.location, true);

	const serviceTypeClass = classNames({
		"tr-smooth": true,
		"tc-primary": !searchParams.get("serviceType"),
		"tc-secondary": searchParams.get("serviceType") === "referenceCollection",
		"tc-tertiary": searchParams.get("serviceType") === "taxonomicExpert",
	});

	switch (filter.type) {
		case "select": {
			if (!filter.options) return <></>;
			const selectedOption: DropdownItem | undefined = filter.options.find((option) => option.value === currentValue);
			const searchInputRef = (filter as any).searchInputRef ?? undefined;

			return (
				<>
					<p className={`${serviceTypeClass} fs-5 fw-lightBold`}>{MakeReadableString(filter.name)}</p>
					<Dropdown
						items={filter.options}
						selectedItem={
							currentValue
								? {
									label: MakeReadableString(selectedOption?.label ?? `${currentValue}`),
									value: `${currentValue}`,
								}
							: undefined
						}
						placeholder={MakeReadableString(filter.name)}
						hasDefault={hasDefault}
						styles={{ color: dropDownColor }}
						searchable
						onOpen={() => {
							setTimeout(() => {
								searchInputRef?.current?.focus();
							}, 50);
						}}
						searchInputRef={searchInputRef}
						OnChange={(item: DropdownItem) => {
							SetFilterValue(item.value);
							SubmitForm();
						}}
					/>
				</>
			);
		}
		case "date": {
			return (
				<>
					<p className={`${serviceTypeClass} fs-5 fw-lightBold`}>{MakeReadableString(filter.name)}</p>
					<DatePicker
						selected={currentValue instanceof Date ? currentValue : undefined}
						placeholder="Publishing date"
						OnChange={(date: Date) => SetFilterValue(date)}
					/>
				</>
			);
		}
		default: {
			return (
				<>
					<p className={`${serviceTypeClass} fs-5 fw-lightBold`}>{MakeReadableString(filter.name)}</p>
					<QueryBar
						name={filter.name}
						placeholder={MakeReadableString(filter.placeholder ?? filter.name)}
					/>
				</>
			);
		}
	}
};

export default Filter;
