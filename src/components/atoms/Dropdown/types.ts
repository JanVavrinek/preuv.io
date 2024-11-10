import type { JSX } from "solid-js";

export type DropdownItem = {
	label: JSX.Element;
	disabled?: boolean;
	onSelect?: () => void;
	items?: Omit<DropdownItem, "items">[];
	href?: string;
};

export type DropdownProps = {
	items: DropdownItem[];
	class?: string;
};
