import type { SlotProp } from "@utils/styles";
import type { imageFallbackStyles } from "./styles";

export type ImageFallbackSlots = keyof (typeof imageFallbackStyles)["slots"];

export type ImageFallbackProps = {
	text: string;
	class?: string;
	maxTextLength?: number;
} & SlotProp<ImageFallbackSlots>;
