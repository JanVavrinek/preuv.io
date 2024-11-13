import { tv } from "tailwind-variants";

export const alertStyles = tv({
	slots: {
		root: "flex items-center p-3 border rounded-xl relative before:content-[''] before:absolute before:w-2 before:h-full before:left-0 overflow-hidden",
		icon: "text-2xl/[0]",
	},
	variants: {
		variant: {
			success: {},
			info: {},
			warning: {},
			danger: {},
		},
	},
	compoundVariants: [
		{
			variant: "success",
			class: {
				root: "before:bg-pv-green-400 border-pv-green-200",
				icon: "text-pv-green-400",
			},
		},
		{
			variant: "info",
			class: {
				root: "before:bg-pv-navy-400 border-pv-navy-200",
				icon: "text-pv-navy-400",
			},
		},
		{
			variant: "warning",
			class: {
				root: "before:bg-pv-yellow-400 border-pv-yellow-200",
				icon: "text-pv-yellow-400",
			},
		},
		{
			variant: "danger",
			class: {
				root: "before:bg-pv-red-400 border-pv-red-200",
				icon: "text-pv-red-400",
			},
		},
	],
	defaultVariants: {
		variant: "info",
	},
});
