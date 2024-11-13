import { WidgetType } from "@lib/db/schemas/widget";
import CommentsWidgetDesignEditor from "@molecules/App/views/Widget/components/DesignEditors/Comments";
import SimpleWidgetDesignEditor from "@molecules/App/views/Widget/components/DesignEditors/Simple";
import CommentsWidget from "@molecules/Widgets/Comments";
import SimpleWidget from "@molecules/Widgets/Simple";
import type {} from "solid-js";

const options = {
	[WidgetType.SIMPLE]: {
		component: SimpleWidget,
		editor: SimpleWidgetDesignEditor,
	},
	[WidgetType.COMMENTS]: {
		component: CommentsWidget,
		editor: CommentsWidgetDesignEditor,
	},
} as const;
export default options;
