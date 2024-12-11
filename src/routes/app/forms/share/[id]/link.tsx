import Button from "@atoms/Button";
import Collapsible from "@atoms/Collapsible";
import Input from "@atoms/Input";
import { toast } from "@atoms/Toaster";
import useI18n from "@lib/i18n/hooks/useI18n";
import { urlSlugSchema } from "@lib/schemas/url";
import { client } from "@lib/trpc/client";
import { getValue } from "@modular-forms/solid";
import formContext, { formEditContextSchema as schema } from "@molecules/layouts/App/views/Form/contexts/Form";
import { debounce } from "@solid-primitives/scheduled";
import { FaSolidCopy } from "solid-icons/fa";
import { createEffect, createSignal, useContext } from "solid-js";
import { z } from "zod";

export default function FormLinkShare() {
	const { c } = useI18n();
	const { formData, Field, Form, form } = useContext(formContext);
	const [slugAvailable, setSlugAvailable] = createSignal<"taken" | "available">("available");
	const [socialPost, setSocilaPost] = createSignal(c.app.formShare.link.socials.postExample());

	const trigger = debounce(
		(slug: string) =>
			client.form.slugCheck
				.query({ slug: slug, id: formData()?.form.id })
				.then((res) => setSlugAvailable(res ? "available" : "taken")),
		500,
	);

	createEffect(() => {
		const slug = urlSlugSchema.safeParse(getValue(form, "slug"));
		if (slug.error) return;
		trigger.clear();
		trigger(slug.data);
	});

	const handleShare = () => {
		window.navigator.clipboard.writeText(`${import.meta.env.VITE_BASE_URL}/form/${formData()?.form.slug}`);
		toast.show(c.generic.common.clipboard());
	};

	return (
		<div class="flex w-full flex-col gap-2 p-5">
			<Collapsible
				triggerChildren={
					<div class="flex flex-col items-start text-start">
						<p class="text-pv-blue-500 text-xl">{c.app.formShare.link.formLink.title()}</p>
						<p class="text-pv-blue-400 text-sm">{c.app.formShare.link.formLink.subtitle()}</p>
					</div>
				}
				defaultOpen
			>
				<Form class="flex flex-row items-center gap-3">
					<div class="flex flex-grow flex-col sm:flex-row">
						<Input
							disabled
							value={`${import.meta.env.VITE_BASE_URL}/form/`}
							slotClasses={{
								wrapper: "sm:rounded-r-none sm:border-r-0",
							}}
							class="sm:w-max sm:[&>*]:w-max"
						/>
						<Field name="slug">
							{(field, props) => (
								<Input
									inputProps={props}
									value={field.value}
									required
									parseResult={z
										.object({
											value: schema.shape[field.name],
											available: z.enum(["available"], { message: "slug-taken" }),
										})
										.safeParse({ value: field.value, available: slugAvailable() })}
									showErrors={field.dirty && form.dirty}
									placeholder={c.app.form.detail.slugPlaceholder()}
									disabled
									slotClasses={{
										wrapper: "sm:rounded-l-none",
									}}
								/>
							)}
						</Field>
					</div>

					<Button class="w-12" onclick={handleShare}>
						{<FaSolidCopy />}
					</Button>
				</Form>
			</Collapsible>
			<Collapsible
				triggerChildren={
					<div class="flex flex-col items-start text-start">
						<p class="text-pv-blue-500 text-xl">{c.app.formShare.link.socials.title()}</p>
						<p class="text-pv-blue-400 text-sm">{c.app.formShare.link.socials.subtitle()}</p>
					</div>
				}
				defaultOpen
			>
				<Input value={socialPost()} onChange={setSocilaPost} textArea />
			</Collapsible>
		</div>
	);
}
