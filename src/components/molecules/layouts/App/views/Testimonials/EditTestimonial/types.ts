import type { ListTestimonial } from "@lib/trpc/routers/testimonial/types";
import type { JSX } from "solid-js";

export type EditTestimonialProps = {
	testimonial?: ListTestimonial;
	openTrigger: JSX.Element;
	onDelete?: () => void;
	onUpdate: (testimonial: ListTestimonial) => void;
};
