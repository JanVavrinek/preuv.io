import Collapsible from "@atoms/Collapsible";
import Input from "@atoms/Input";
import Toggle from "@atoms/Toggle";
import useI18n from "@lib/i18n/hooks/useI18n";
import { getValue, setValue } from "@modular-forms/solid";
import { useContext } from "solid-js";
import formContext, { formEditContextSchema as schema } from "../../contexts/Form";

export default function General() {
	const { c } = useI18n();
	const { Field, hasPermission, form } = useContext(formContext);

	return (
		<Collapsible triggerChildren={c.app.form.detail.general()} defaultOpen>
			<Field name="name">
				{(field, props) => (
					<Input
						inputProps={props}
						value={field.value}
						required
						label={c.app.form.detail.name()}
						parseResult={schema.shape[field.name].safeParse(field.value)}
						showErrors={!!field.error.length}
						placeholder={c.app.organization.organizationPlaceholder()}
						readOnly={!hasPermission()}
					/>
				)}
			</Field>
			<Field name="active" type="boolean">
				{(field, props) => (
					<Toggle
						label={c.app.form.detail.active()}
						disabled={!hasPermission()}
						inputProps={props}
						checked={getValue(form, "active")}
						onChange={(v) => setValue(form, "active", v)}
					/>
				)}
			</Field>
		</Collapsible>
	);
}
