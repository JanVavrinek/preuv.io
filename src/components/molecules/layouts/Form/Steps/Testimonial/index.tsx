import Button from "@atoms/Button";
import Input from "@atoms/Input";
import useI18n from "@lib/i18n/hooks/useI18n";
import { createForm, setValue, toCustom, zodForm } from "@modular-forms/solid";
import Rating from "@molecules/common/Rating";
import formContext, { formContextDataSchema } from "@molecules/layouts/Form/contexts/Form";
import { FaSolidArrowLeft, FaSolidArrowRight } from "solid-icons/fa";
import { type VoidProps, batch, useContext } from "solid-js";
import type { FormSubmitHandler } from "../../../../../../types/forms";
import type { TestimonialProps } from "./types";

const schema = formContextDataSchema.shape.testimonial;

export default function Testimonial(props: VoidProps<TestimonialProps>) {
	const { c } = useI18n();
	const { data, setData } = useContext(formContext);
	const [testimonialForm, { Field, Form }] = createForm({
		validate: zodForm(schema),
		initialValues: data.testimonial,
	});

	const handleSubmit: FormSubmitHandler<typeof Form> = (values) => {
		batch(() => {
			setData("testimonial", "rating", values.rating);
			setData("testimonial", "text", values.text);
		});
		props.onNext();
	};

	return (
		<Form class="flex w-full flex-col gap-2" onSubmit={handleSubmit}>
			<h1 class="text-center font-bold text-2xl text-pv-blue-500">{c.form.testimonial.title()}</h1>
			<Field name="text">
				{(field, props) => (
					<Input
						inputProps={props}
						value={field.value}
						required
						label={c.form.testimonial.review()}
						placeholder={c.form.testimonial.reviewPlaceholder()}
						parseResult={schema.shape[field.name].safeParse(field.value)}
						showErrors={!!field.error.length}
						textArea
						textAreaProps={{
							autoResize: true,
							rows: 5,
						}}
						maxLength={schema.shape[field.name].maxLength ?? undefined}
						minLength={schema.shape[field.name].minLength ?? undefined}
					/>
				)}
			</Field>
			<div class="flex justify-center pb-4">
				<Field name="rating" type="number" transform={toCustom((v) => Number(v), { on: "input" })}>
					{(field, props) => (
						<Rating
							inputProps={props}
							value={Number(field.value)}
							onValue={(v) => setValue(testimonialForm, "rating", v)}
						/>
					)}
				</Field>
			</div>
			<div class="flex flex-col-reverse gap-2 sm:flex-row">
				<Button icon={<FaSolidArrowLeft />} class="w-full sm:w-1/3" variant="danger" onclick={props.onBack}>
					{c.generic.actions.back()}
				</Button>
				<Button
					type="submit"
					disabled={testimonialForm.invalid}
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
