import Combobox from "@atoms/Combobox";
import { WidgetType, widgetOptionsSchema } from "@lib/db/schemas/widget";
import useI18n from "@lib/i18n/hooks/useI18n";
import options from "@lib/widgets";
import { widgetOptionsDefaults } from "@lib/widgets/defaults";
import widgetContext from "@molecules/App/views/Widget/context/Widget";
import { Show, batch, createMemo, useContext } from "solid-js";
import { Dynamic } from "solid-js/web";

export default function WidgetDesignView() {
	const { c } = useI18n();
	const { widget, testimonials, setWidget } = useContext(widgetContext);
	const components = createMemo(() => {
		const d = options[widget.widget.type];
		return d;
	});

	const widgetOptions = createMemo(() => {
		const parse = widgetOptionsSchema.safeParse({
			type: widget.widget.type,
			options: widget.widget.options,
		});
		if (parse.error) return;
		return parse.data.options;
	});

	const handleSetWidgetType = (widgetType: WidgetType) => {
		batch(() => {
			setWidget("widget", "type", widgetType);
			setWidget("widget", "options", widgetOptionsDefaults[widgetType]);
		});
	};

	return (
		<div class="flex w-full flex-grow flex-row">
			<div class="w-full max-w-96 flex-shrink-0 flex-grow border-pv-blue-200 border-r bg-pv-blue-50 p-2">
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
				<Dynamic component={components().editor} />
			</div>
			<div class="flex-grow p-2">
				<Show when={widgetOptions()} keyed>
					{(o) => <Dynamic component={components().component} options={o} testimonials={testimonials()} />}
				</Show>
			</div>
		</div>
	);
}
