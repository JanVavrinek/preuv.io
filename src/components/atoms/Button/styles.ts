import { tv } from "tailwind-variants";

export const buttonStyles = tv({
	slots: {
		root: "-translate-x-[5px] -translate-y-[5px] hover:-translate-x-[3px] hover:-translate-y-[3px] m-[5px] flex h-12 items-center justify-center rounded-full border-4 border-pv-blue-900 px-2 shadow-lg transition-all duration-150 hover:shadow-md disabled:translate-x-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:shadow-none disabled:contrast-50",
		icon: "",
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
				root: "bg-pv-green-500",
			},
		},
		{
			variant: "danger",
			class: {
				root: "bg-pv-red-500",
			},
		},
		{
			variant: "info",
			class: {
				root: "bg-pv-navy-400",
			},
		},
		{
			variant: "warning",
			class: {
				root: "bg-pv-yellow-400",
			},
		},
	],
	defaultVariants: {
		variant: "info",
	},
});
