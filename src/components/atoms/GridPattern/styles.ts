import { tv } from "tailwind-variants";

export const gridPatternStyles = tv({
	slots: {
		root: "pointer-events-none absolute inset-0 h-full w-full fill-pv-blue-400/60 stroke-pv-blue-400/60",
	},
});
