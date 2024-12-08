import Combobox from "@atoms/Combobox";
import { WidgetType, widgetOptionsSchema } from "@lib/db/schemas/widget";
import useI18n from "@lib/i18n/hooks/useI18n";
import options from "@lib/widgets";
import { widgetOptionsDefaults } from "@lib/widgets/defaults";
import Share from "@molecules/layouts/App/views/Widget/components/Share";
import widgetContext from "@molecules/layouts/App/views/Widget/context/Widget";
import { Show, batch, createMemo, useContext } from "solid-js";
import { reconcile } from "solid-js/store";
import { Dynamic } from "solid-js/web";

export default function WidgetDesignView() {
	const { c } = useI18n();
	const { widget, testimonials, setWidget, sidebarOpen } = useContext(widgetContext);

	const widgetOptions = createMemo(() => {
		const parse = widgetOptionsSchema.safeParse({
			type: widget.widget.type,
			options: widget.widget.options,
		});
		if (parse.error) return;
		return { components: options[parse.data.type], options: parse.data.options };
	});

	const handleSetWidgetType = (widgetType: WidgetType) => {
		batch(() => {
			setWidget("widget", "type", widgetType);
			setWidget("widget", "options", reconcile(widgetOptionsDefaults[widgetType]));
		});
	};

	return (
		<div class="relative flex w-full flex-grow flex-row overflow-hidden">
			<div
				class=" flex w-full max-w-96 flex-shrink-0 flex-grow flex-col gap-2 rounded-bl-xl border-pv-blue-200 border-r bg-pv-blue-50 p-2 transition-all duration-150 ease-in-out"
				classList={{
					"-ml-96": !sidebarOpen(),
					"m-0": sidebarOpen(),
				}}
			>
				<Combobox
					value={{
						label: c.app.widget.detail.design.editor.types.types[widget.widget.type](),
						value: widget.widget.type,
					}}
					options={[
						{
							label: c.app.widget.detail.design.editor.types.types.simple(),
							value: WidgetType.SIMPLE,
						},
						{
							label: c.app.widget.detail.design.editor.types.types.comments(),
							value: WidgetType.COMMENTS,
						},
					]}
					onChange={(v) => (v?.value ? handleSetWidgetType(v.value as WidgetType) : undefined)}
				/>
				<Share />
				<hr />
				<Dynamic component={widgetOptions()?.components.editor} />
			</div>
			<div class="flex-grow p-2">
				<Show when={widgetOptions()} keyed>
					{(o) => (
						<Dynamic
							component={o.components.component}
							options={o.options as never}
							testimonials={testimonials().filter((t) => t.testimonial.approved)}
						/>
					)}
				</Show>
			</div>
		</div>
	);
}
