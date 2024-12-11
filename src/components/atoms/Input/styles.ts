import { tv } from "tailwind-variants";

export const inputStyles = tv({
	slots: {
		root: "group flex w-full flex-col gap-1",
		wrapper:
			"relative flex min-h-14 flex-row items-center overflow-hidden rounded-2xl border border-pv-blue-200 bg-pv-blue-100 transition-all duration-300 group-data-[invalid]:border-pv-red-400",
	},
});
