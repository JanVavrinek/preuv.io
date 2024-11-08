import type { ListTestimonial } from "@lib/trpc/routers/testimonial/types";

export type TestimonialProps = {
	testimonial: ListTestimonial;
	onUpdate?: (testimonial: ListTestimonial) => void;

	/** Custom classes applied to the element */
	class?: string;
};
