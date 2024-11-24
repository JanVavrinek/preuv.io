import { WidgetType } from "@lib/db/schemas/widget";
import CommentsWidgetDesignEditor from "@molecules/layouts/App/views/Widget/components/DesignEditors/Comments";
import SimpleWidgetDesignEditor from "@molecules/layouts/App/views/Widget/components/DesignEditors/Simple";
import CommentsWidget from "@molecules/layouts/Widgets/Comments";
import SimpleWidget from "@molecules/layouts/Widgets/Simple";
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
