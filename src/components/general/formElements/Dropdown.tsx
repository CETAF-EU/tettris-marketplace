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
	const [selectItems, setSelectItems] = useState<typeof items>(items);

	useEffect(() => {
		if (
			(placeholder && !selectedItem && !items.find((item) => [placeholder, "Reset filter"].includes(item.label)))
		) {
			items.unshift({
				label: placeholder,
				value: "",
			});
		}
		setSelectItems([...items]);
	}, [items, placeholder, selectedItem]);

	const CheckItems = (option: SingleValue<DropdownItem> | undefined) => {
		if ((option?.value || selectedItem) && !selectItems.find((item) => item.label === "Reset filter")) {
			if (!hasDefault && selectItems[0].label !== placeholder) {
				selectItems.unshift({
					label: "Reset filter",
					value: "",
				});
			} else if (!hasDefault) {
				selectItems[0].label = "Reset filter";
			}
		} else if (!option?.value && selectItems.find((item) => item.label === "Reset filter")) {
			selectItems[0].label = placeholder ?? "Select an option";
		}
		setSelectItems([...selectItems]);
	};

	const menuPortalTarget = useRef<HTMLElement | null>(null);
	useEffect(() => {
		menuPortalTarget.current = document.body;
	}, []);

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
