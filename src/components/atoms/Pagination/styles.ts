import { tv } from "tailwind-variants";

export const paginationStyles = tv({
	slots: {
		root: "[&>ul]:flex [&>ul]:flex-row [&>ul]:gap-2",
	},
});
