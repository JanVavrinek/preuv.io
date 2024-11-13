import { WidgetType } from "@lib/db/schemas/widget";

const widgetTypes: Record<WidgetType, string> = {
	[WidgetType.COMMENTS]: "Comments",
	[WidgetType.SIMPLE]: "Simple",
};
export default widgetTypes;
