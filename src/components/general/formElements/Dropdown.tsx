import { useEffect, useState, useRef } from "react";
import Select, { SingleValue } from "react-select";

/* Import Types */
import { DropdownItem } from "app/Types";

interface Props {
	items: {
		label: string;
		value: string;
		action?: Function;
	}[];
	selectedItem?: {
		label: string;
		value: string;
	};
	placeholder?: string;
	hasDefault?: boolean;
	styles?: {
		color?: string;
	};
	OnChange?: Function;
	searchable?: boolean;
	onOpen?: () => void;
	searchInputRef?: React.RefObject<HTMLInputElement>;
}

const Dropdown = ({
	selectedItem,
	items,
	placeholder,
	hasDefault,
	styles,
	OnChange,
	searchable = false,
	onOpen,
}: Props) => {
	const [selectItems, setSelectItems] = useState<typeof items>([]);

	const menuPortalTarget = useRef<HTMLElement | null>(null);

	useEffect(() => {
		menuPortalTarget.current = document.body;
	}, []);

	useEffect(() => {
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
		} else if (placeholder && !selectedItem && !newItems.find((item) => item.label === placeholder)) {
			newItems.unshift({
				label: placeholder,
				value: "",
			});
		}

		setSelectItems(newItems);
	}, [items, placeholder, selectedItem, hasDefault]);

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
		<Select
			value={selectedItem ?? { label: placeholder ?? "Select an option", value: "" }}
			defaultValue={{ label: placeholder ?? "Select an option", value: "" }}
			options={selectItems}
			className="tc-white"
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
					borderColor: "#333333",
					minHeight: "auto",
					fontWeight: "500",
					fontSize: "0.875rem",
					padding: "0.3rem 0.5rem",
					":hover": { borderColor: `${styles?.color}` },
					":active": { borderColor: `${styles?.color}` },
				}),
				menu: (provided) => ({
					...provided,
					zIndex: 100000,
					fontSize: "0.875rem",
					width: "100%",
					color: "#333333",
				}),
				placeholder: (provided) => ({ ...provided, color: "#FF8E3E" }),
				dropdownIndicator: (provided) => ({ ...provided, color: "#333333", fontSize: "0.875rem" }),
				singleValue: (provided) => ({ ...provided, color: "#333333" }),
				valueContainer: (provided) => ({ ...provided, width: "max-content", padding: "0px" }),
				clearIndicator: (provided) => ({ ...provided, padding: "0px" }),
				indicatorsContainer: (provided) => ({ ...provided, height: "1.5rem" }),
				input: (provided) => ({ ...provided, margin: "0px" }),
				indicatorSeparator: () => ({ display: "none" }),
				option: (provided, state) => ({
					...provided,
					width: "100%",
					backgroundColor: state.isSelected && styles?.color ? styles.color : undefined,
					":hover": { backgroundColor: !state.isSelected ? "#f1f1f3" : undefined },
					fontWeight: state.isSelected ? "bold" : "",
				}),
			}}
			onChange={(option: SingleValue<DropdownItem>) => {
				OnChange ? OnChange(option) : option?.action?.();
				CheckItems(option);
			}}
		/>
	);
};

export default Dropdown;
