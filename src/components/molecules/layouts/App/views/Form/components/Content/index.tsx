import useI18n from "@lib/i18n/hooks/useI18n";
import formConfig from "@lib/mdx/form";
import { setValue } from "@modular-forms/solid";
import { clientOnly } from "@solidjs/start";
import { useContext } from "solid-js";
import formContext from "../../contexts/Form";
const MarkdownEditor = clientOnly(() => import("@molecules/common/MarkdownEditor"));

export default function Content() {
	const { c } = useI18n();
	const { Field, form } = useContext(formContext);

	return (
		<div class="px-4">
			<p class="font-bold text-pv-blue-400">{c.app.form.detail.content.welcome()}</p>
			<Field name="welcome">
				{(field, props) => (
					<>
						<MarkdownEditor
							markdownComponents={formConfig}
							class="w-full py-4 text-pv-blue-500"
							value={field.value ?? ""}
							onChange={(v) => setValue(form, "welcome", v)}
						/>
						<input value={field.value} {...props} hidden />
					</>
				)}
			</Field>
			<hr />
			<p class="pt-2 font-bold text-pv-blue-400">{c.app.form.detail.content.thankyou()}</p>
			<Field name="thankyou">
				{(field, props) => (
					<>
						<MarkdownEditor
							markdownComponents={formConfig}
							class="w-full py-4 text-pv-blue-500"
							value={field.value ?? ""}
							onChange={(v) => setValue(form, "thankyou", v)}
						/>
						<input value={field.value} {...props} hidden />
					</>
				)}
			</Field>
		</div>
	);
}
