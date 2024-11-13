import { tv } from "tailwind-variants";

export const buttonStyles = tv({
	slots: {
		root: "hover:-translate-y-[5px] flex h-12 items-center justify-center rounded-3xl active:rounded-2xl px-2 transition-all duration-150 hover:shadow-lg disabled:translate-x-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:shadow-none disabled:contrast-50 font-semibold delay-150 text-pv-navy-50",
		icon: "mr-2",
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
				root: "bg-pv-green-500 text-pv-blue-900",
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
