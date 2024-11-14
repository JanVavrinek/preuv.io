import Collapsible from "@atoms/Collapsible";
import Input from "@atoms/Input";
import Toggle from "@atoms/Toggle";
import { WidgetType, widgetCommentsTypeOptionsSchema as schema } from "@lib/db/schemas/widget";
import useI18n from "@lib/i18n/hooks/useI18n";
import { createForm, getValues, setValue, zodForm } from "@modular-forms/solid";
import { debounce } from "@solid-primitives/scheduled";
import { type VoidProps, createEffect, createMemo, mergeProps, useContext } from "solid-js";
import type { z } from "zod";
import widgetContext from "../../../context/Widget";

function Inner(props: VoidProps<{ options?: z.infer<typeof schema> }>) {
	const { c } = useI18n();
	const { setWidget } = useContext(widgetContext);
	const [form, { Form, Field }] = createForm({
		validate: zodForm(schema),
		initialValues: props.options,
	});
	const trigger = debounce(
		(values: unknown) => {
			const parse = schema.partial().safeParse(values);
			if (parse.error) return;
			setWidget("widget", "options", (s: unknown) => mergeProps(s, parse.data));
		},

		500,
	);

	createEffect(() => {
		const vals = getValues(form);
		trigger.clear();
		trigger(vals);
	});

	return (
		<Form>
			<Field name="accent">
				{(field, props) => (
					<Input
						inputProps={props}
						value={field.value}
						required
						label={c.app.widget.detail.design.editor.properties.accent()}
						parseResult={schema.shape[field.name].safeParse(field.value)}
						showErrors
					/>
				)}
			</Field>
			<Collapsible triggerChildren={c.app.widget.detail.design.editor.properties.userIcon.title()}>
				<Field name="userIcon.radius" type="number" keepState keepActive>
					{(field, props) => (
						<Input
							inputProps={props}
							value={String(field.value)}
							required
							label={c.app.widget.detail.design.editor.properties.radius()}
							parseResult={schema.shape.userIcon.shape.radius.safeParse(field.value)}
							showErrors
							type="number"
						/>
					)}
				</Field>
			</Collapsible>
			<Collapsible triggerChildren={c.app.widget.detail.design.editor.properties.quotes.title()}>
				<Field name="quotes.show" type="boolean">
					{(field, props) => (
						<Toggle
							inputProps={props}
							checked={Boolean(field.value)}
							onChange={(v) => setValue(form, field.name, v)}
							label={c.generic.actions.show()}
						/>
					)}
				</Field>
				<Field name="quotes.size" type="number">
					{(field, props) => (
						<Input
							inputProps={props}
							value={String(field.value)}
							required
							label={c.app.widget.detail.design.editor.properties.size()}
							parseResult={schema.shape.quotes.shape.size.safeParse(field.value)}
							showErrors
							type="number"
						/>
					)}
				</Field>
				<Field name="quotes.accent">
					{(field, props) => (
						<Input
							inputProps={props}
							value={String(field.value)}
							required
							label={c.app.widget.detail.design.editor.properties.accent()}
							parseResult={schema.shape.quotes.shape.accent.safeParse(field.value)}
							showErrors
						/>
					)}
				</Field>
			</Collapsible>
		</Form>
	);
}

export default function CommentsWidgetDesignEditor() {
	const { widget } = useContext(widgetContext);

	const options = createMemo(() => {
		if (widget.widget.type !== WidgetType.COMMENTS) return;
		const parse = schema.safeParse(widget.widget.options);
		return parse.success ? parse.data : undefined;
	});

	return <Inner options={options()} />;
}
