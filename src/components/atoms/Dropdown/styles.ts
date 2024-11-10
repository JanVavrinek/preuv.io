import { tv } from "tailwind-variants";

export const dropdownStyles = tv({
	slots: {
		trigger: "flex h-14 flex-row items-center gap-2 rounded-2xl border border-pv-blue-200 p-2 justify-between",
	},
});
