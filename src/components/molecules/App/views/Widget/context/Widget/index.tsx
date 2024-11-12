import useHasPermissions from "@atoms/PermissionsGuard/hooks/useHasPermissions";
import { RolePermissions } from "@lib/db/schemas/role";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import type { ListWidget } from "@lib/trpc/routers/widget/types";
import AppLayoutTitle from "@molecules/App/AppLayoutTitle";
import { useNavigate } from "@solidjs/router";
import { type Accessor, Show, createMemo } from "solid-js";
import { type ParentProps, createContext, onMount } from "solid-js";
import { type SetStoreFunction, createStore } from "solid-js/store";

const DEFAULT: ListWidget = {
	project: {
		created_at: new Date(),
		id: "",
		name: "",
		organization_id: "",
		image: null,
	},
	widget: {
		created_at: new Date(),
		id: "",
		name: "",
		options: {},
		project_id: "",
		type: "",
	},
};

const widgetContext = createContext<{
	setWidget: SetStoreFunction<ListWidget>;
	widget: ListWidget;
	hasPermission: Accessor<boolean>;
}>({
	setWidget: () => {},
	widget: DEFAULT,
	hasPermission: () => false,
});

export function WidgetProvider(props: ParentProps<{ id: string | "create" }>) {
	const { c } = useI18n();
	const [widget, setWidget] = createStore<ListWidget>(structuredClone(DEFAULT));
	const check = useHasPermissions();

	const navigate = useNavigate();

	onMount(() => {
		if (props.id === "create") return;
		client.widget.getOne
			.query(props.id)
			.then(setWidget)
			.catch(() => navigate("/app/404"));
	});

	const title = createMemo(() => {
		if (props.id === "create") return c.app.widget.create.title();
		const data = widget;
		return data?.widget.name.length ? data.widget.name : c.generic.actions.edit();
	});

	const hasPermission = createMemo(() => {
		if (props.id === "create" && check([RolePermissions.WIDGET_CREATE])) return true;
		return check([RolePermissions.WIDGET_UPDATE]);
	});

	return (
		<widgetContext.Provider value={{ widget, setWidget, hasPermission }}>
			<AppLayoutTitle>{title()}</AppLayoutTitle>
			<Show when={props.id === "create" || widget.widget.id.length}>{props.children}</Show>
		</widgetContext.Provider>
	);
}
export default widgetContext;
