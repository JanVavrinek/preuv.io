import type { JSX } from "solid-js";

export type ConfirmDeleteProps = {
	onConfirm: () => void;
	title?: JSX.Element;
	confirmTitle?: JSX.Element;
};
