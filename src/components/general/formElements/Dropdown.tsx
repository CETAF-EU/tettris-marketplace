import { useEffect, useState, useRef } from "react";
import Select, { SingleValue } from "react-select";

/* Import Types */
import { DropdownItem } from "app/Types";

interface Props {
	items: DropdownItem[];
	selectedItem?: DropdownItem;
	selectedItems?: DropdownItem[];
	placeholder?: string;
	hasDefault?: boolean;
	styles?: {
		color?: string;
	};
	isMulti?: boolean;
	OnChange?: Function;
	searchable?: boolean;
	onOpen?: () => void;
}

const Dropdown = ({
	selectedItem,
	selectedItems,
	items,
	placeholder,
	hasDefault,
	styles,
	isMulti = false,
	OnChange,
	searchable = false,
	onOpen,
}: Props) => {
	const [selectItems, setSelectItems] = useState<typeof items>([]);
	const activeColor = styles?.color ?? "#333333";

	const menuPortalTarget = useRef<HTMLElement | null>(null);

	useEffect(() => {
		menuPortalTarget.current = document.body;
	}, []);

	useEffect(() => {
		if (isMulti) {
			setSelectItems(items);
			return;
		}

		const newItems = [...items];

		const hasResetFilter = newItems.some((item) => item.label === "Reset filter");

		// Always ensure "Reset filter" or placeholder is present at top when hasDefault is false
		if (!hasDefault && !hasResetFilter) {
			newItems.unshift({
				label: "Reset filter",
				value: "",
			});
		} else if (!hasDefault && hasResetFilter) {
			newItems[0] = {
				label: "Reset filter",
				value: "",
			};
		} else if (placeholder && !selectedItem && !newItems.some((item) => item.label === placeholder)) {
			newItems.unshift({
				label: placeholder,
				value: "",
			});
		}

		setSelectItems(newItems);
	}, [items, placeholder, selectedItem, hasDefault, isMulti]);

	const CheckItems = (option: SingleValue<DropdownItem> | undefined) => {
		let updatedItems = [...selectItems];
		const hasReset = updatedItems.some((item) => item.label === "Reset filter");

		if ((option?.value || selectedItem) && !hasReset) {
			if (!hasDefault && updatedItems[0].label !== placeholder) {
				updatedItems.unshift({
					label: "Reset filter",
					value: "",
				});
			} else if (!hasDefault) {
				updatedItems[0] = {
					label: "Reset filter",
					value: "",
				};
			}
		} else if (!option?.value && hasReset) {
			updatedItems[0] = {
				label: placeholder ?? "Select an option",
				value: "",
			};
		}

		setSelectItems(updatedItems);
	};

	return (
		<Select<DropdownItem, boolean>
			value={
				isMulti
					? selectedItems ?? []
					: selectedItem ?? { label: placeholder ?? "Select an option", value: "" }
			}
			defaultValue={{ label: placeholder ?? "Select an option", value: "" }}
			options={selectItems}
			className="tc-white"
			isMulti={isMulti}
			isClearable={isMulti}
			closeMenuOnSelect={!isMulti}
			isSearchable={searchable}
			onMenuOpen={() => {
				onOpen?.();
			}}
			menuPortalTarget={menuPortalTarget.current ?? undefined}
			menuPosition="absolute"
			styles={{
				control: (provided) => ({
					...provided,
					backgroundColor: "#ffffff",
					borderRadius: "none",
					borderColor: activeColor,
					minHeight: "2.6rem",
					maxHeight: "2.6rem",
					overflow: "hidden",
					fontWeight: "500",
					fontSize: "0.875rem",
					padding: "0.3rem 0.5rem",
					boxShadow: "none",
					":hover": { borderColor: activeColor },
					":active": { borderColor: activeColor },
				}),
				menu: (provided) => ({
					...provided,
					zIndex: 100000,
					fontSize: "0.875rem",
					width: "100%",
					color: "#333333",
				}),
				placeholder: (provided) => ({ ...provided, color: activeColor, opacity: 0.85 }),
				dropdownIndicator: (provided) => ({ ...provided, color: activeColor, fontSize: "0.875rem" }),
				singleValue: (provided) => ({ ...provided, color: "#333333" }),
				valueContainer: (provided) => ({
					...provided,
					width: isMulti ? "100%" : "max-content",
					padding: "0px",
					maxHeight: isMulti ? "1.8rem" : undefined,
					overflowY: isMulti ? "auto" : undefined,
					overflowX: "hidden",
				}),
				clearIndicator: (provided) => ({ ...provided, padding: "0px" }),
				indicatorsContainer: (provided) => ({ ...provided, height: "1.8rem" }),
				input: (provided) => ({ ...provided, margin: "0px" }),
				indicatorSeparator: () => ({ display: "none" }),
				multiValue: (provided) => ({
					...provided,
					backgroundColor: `${activeColor}20`,
					border: `1px solid ${activeColor}55`,
				}),
				multiValueLabel: (provided) => ({
					...provided,
					color: activeColor,
				}),
				multiValueRemove: (provided) => ({
					...provided,
					color: activeColor,
					":hover": {
						backgroundColor: activeColor,
						color: "#ffffff",
					},
				}),
				option: (provided, state) => ({
					...provided,
					width: "100%",
					backgroundColor: state.isSelected ? activeColor : undefined,
					color: state.isSelected ? "#ffffff" : "#333333",
					":hover": { backgroundColor: state.isSelected ? undefined : "#f1f1f3" },
					fontWeight: state.isSelected ? "bold" : "",
				}),
			}}
			onChange={(selectedOption) => {
				OnChange?.(selectedOption);

				if (!isMulti) {
					CheckItems(selectedOption as SingleValue<DropdownItem>);
				}
			}}
		/>
	);
};

export default Dropdown;
