import { tv } from "tailwind-variants";

export const dialogStyles = tv({
	slots: {
		content: "flex max-h-full w-full flex-col rounded-xl max-w-3xl border border-pv-blue-200 bg-pv-blue-50  shadow-lg",
		title: "font-bold text-xl md:text-2xl",
		description: "text-sm text-gray-400",
		contentWrapper: "overflow-auto p-3",
	},
});
