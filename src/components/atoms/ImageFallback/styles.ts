import { tv } from "tailwind-variants";

export const imageFallbackStyles = tv({
	slots: {
		root: "relative grid h-full w-full place-items-center before:absolute before:inset-0 before:bg-[--random-color] before:opacity-15 before:content-['']",
		text: "font-black text-6xl text-[--random-color] uppercase",
	},
});
