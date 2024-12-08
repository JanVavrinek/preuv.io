import Button from "@atoms/Button";
import Input from "@atoms/Input";
import useI18n from "@lib/i18n/hooks/useI18n";
import { submitFormAction } from "@lib/server/routes/form";
import { createForm, zodForm } from "@modular-forms/solid";
import formContext, { formContextDataSchema } from "@molecules/layouts/Form/contexts/Form";
import { useAction, useParams } from "@solidjs/router";
import { FaSolidArrowLeft, FaSolidArrowRight } from "solid-icons/fa";
import { type VoidProps, useContext } from "solid-js";
import { reconcile } from "solid-js/store";
import type { FormSubmitHandler } from "../../../../../../types/forms";
import type { CustomerProps } from "./types";

const schema = formContextDataSchema.shape.customer;

export default function Customer(props: VoidProps<CustomerProps>) {
	const params = useParams<{ form: string }>();
	const { c } = useI18n();
	const { data, setData } = useContext(formContext);
	const [testimonialForm, { Field, Form }] = createForm({
		validate: zodForm(schema),
		initialValues: data.customer,
	});
	const submitForm = useAction(submitFormAction);

	const handleSubmit: FormSubmitHandler<typeof Form> = async (values) => {
		setData("customer", reconcile(values));
		props.onNext();
		const p = submitForm({ form: params.form, data });

		await p;
		props.onNext();
	};

	return (
		<Form class="flex w-full flex-col gap-2" onSubmit={handleSubmit}>
			<h1 class="text-center font-bold text-2xl text-pv-blue-500">{c.form.customer.title()}</h1>
			<Field name="email">
				{(field, props) => (
					<Input
						inputProps={props}
						value={field.value}
						required
						label="E-mail"
						placeholder="jane@preuv.io"
						parseResult={schema.shape[field.name].safeParse(field.value)}
						showErrors={!!field.error.length}
					/>
				)}
			</Field>
			<Field name="name">
				{(field, props) => (
					<Input
						inputProps={props}
						value={field.value}
						required
						label={c.generic.common.name()}
						placeholder="Jane Doe"
						parseResult={schema.shape[field.name].safeParse(field.value)}
						showErrors={!!field.error.length}
					/>
				)}
			</Field>
			<Field name="company">
				{(field, props) => (
					<Input
						inputProps={props}
						value={field.value ?? ""}
						required
						label={c.app.customer.detail.company.label()}
						placeholder={c.app.customer.detail.company.placeholder()}
						parseResult={schema.shape[field.name].safeParse(field.value)}
						showErrors={!!field.error.length}
					/>
				)}
			</Field>
			<Field name="title">
				{(field, props) => (
					<Input
						inputProps={props}
						value={field.value ?? ""}
						required
						label={c.app.customer.detail.title.label()}
						placeholder={c.app.customer.detail.title.placeholder()}
						parseResult={schema.shape[field.name].safeParse(field.value)}
						showErrors={!!field.error.length}
					/>
				)}
			</Field>
			<Field name="url">
				{(field, props) => (
					<Input
						inputProps={props}
						value={field.value ?? ""}
						required
						label="URL"
						placeholder="https://..."
						parseResult={schema.shape[field.name].safeParse(field.value)}
						showErrors={!!field.error.length}
					/>
				)}
			</Field>

			<div class="flex flex-col-reverse gap-2 sm:flex-row">
				<Button icon={<FaSolidArrowLeft />} class="w-full sm:w-1/3" variant="danger" onclick={props.onBack}>
					{c.generic.actions.back()}
				</Button>
				<Button
					type="submit"
					disabled={testimonialForm.invalid || testimonialForm.submitting}
					icon={<FaSolidArrowRight />}
					class="w-full flex-row-reverse"
					slotClasses={{ icon: "mr-0 ml-2" }}
				>
					{c.generic.actions.continue()}
				</Button>
			</div>
		</Form>
	);
}
