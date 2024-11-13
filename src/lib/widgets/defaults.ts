import {
	WidgetType,
	type widgetCommentsTypeOptionsSchema,
	type widgetSimpleTypeOptionsSchema,
} from "@lib/db/schemas/widget";
import type { z } from "zod";

export const simpleWidgetDefaultOptions: z.infer<typeof widgetSimpleTypeOptionsSchema> = {
	accent: "#ff0000",
} as const;

export const commentsWidgetDefaultOptions: z.infer<typeof widgetCommentsTypeOptionsSchema> = {
	accent: "#ff0000",
	radius: 10,
} as const;

export const widgetOptionsDefaults = {
	[WidgetType.SIMPLE]: simpleWidgetDefaultOptions,
	[WidgetType.COMMENTS]: commentsWidgetDefaultOptions,
} as const;
