import type { widgetCommentsTypeOptionsSchema } from "@lib/db/schemas/widget";
import type { z } from "zod";
import type { WidgetTestimonial } from "../types";

export type CommentsWidgetProps = {
	testimonials: WidgetTestimonial[];
	options: z.infer<typeof widgetCommentsTypeOptionsSchema>;
};
