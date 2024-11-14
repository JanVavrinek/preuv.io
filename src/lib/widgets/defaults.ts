import {
	WidgetType,
	type widgetCommentsTypeOptionsSchema,
	type widgetSimpleTypeOptionsSchema,
} from "@lib/db/schemas/widget";
import type { z } from "zod";

export const simpleWidgetDefaultOptions: z.infer<typeof widgetSimpleTypeOptionsSchema> = {
	accent: "#fff",
	userIcon: {
		show: true,
		radius: 10,
	},
} as const;

export const commentsWidgetDefaultOptions: z.infer<typeof widgetCommentsTypeOptionsSchema> = {
	accent: "#fff",
	userIcon: {
		radius: 10,
	},
	quotes: {
		accent: "#000",
		show: true,
		size: 20,
	},
} as const;

export const widgetOptionsDefaults = {
	[WidgetType.SIMPLE]: simpleWidgetDefaultOptions,
	[WidgetType.COMMENTS]: commentsWidgetDefaultOptions,
} as const;
