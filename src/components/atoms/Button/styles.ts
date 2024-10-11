import { tv } from "tailwind-variants";

export const buttonStyles = tv({
	slots: {
		root: "hover:-translate-x-[5px] hover:-translate-y-[5px] flex h-12 items-center justify-center rounded-3xl active:rounded-2xl border-4 border-pv-blue-900 px-2 transition-all duration-150 hover:shadow-lg disabled:translate-x-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:shadow-none disabled:contrast-50 dark:border-pv-blue-950 hover:dark:shadow-pv-blue-950 font-semibold",
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
