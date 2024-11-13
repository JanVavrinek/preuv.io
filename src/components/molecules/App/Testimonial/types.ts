import type { ListTestimonial } from "@lib/trpc/routers/testimonial/types";
import type { JSX } from "solid-js";

export type TestimonialProps = {
	testimonial: ListTestimonial;
	onUpdate?: (testimonial: ListTestimonial) => void;

	/** Custom classes applied to the element */
	class?: string;

	actionsSlot?: JSX.Element;
};
