import type { widgetSimpleTypeOptionsSchema } from "@lib/db/schemas/widget";
import type { z } from "zod";
import type { WidgetTestimonial } from "../types";

export type SimpleWidgetProps = {
	testimonials: WidgetTestimonial[];
	options: z.infer<typeof widgetSimpleTypeOptionsSchema>;
};
