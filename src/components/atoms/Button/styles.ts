import { tv } from "tailwind-variants";

export const buttonStyles = tv({
	slots: {
		root: "h-12 px-2 flex items-center justify-center rounded-full border-4 border-pv-blue-900 shadow-lg hover:shadow-md -translate-x-[5px] -translate-y-[5px] hover:-translate-x-[3px] hover:-translate-y-[3px] transition-all duration-150 m-[5px] disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 disabled:contrast-50",
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
