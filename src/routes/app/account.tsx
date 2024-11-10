import Button from "@atoms/Button";
import Input from "@atoms/Input";
import { toast } from "@atoms/Toaster";
import { userContext } from "@contexts/User";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import { userUpdateMutationInputSchema as schema } from "@lib/trpc/routers/user/schemas";
import type { UserUpdateMutationInputSchema } from "@lib/trpc/routers/user/types";
import { type SubmitHandler, createForm, zodForm } from "@modular-forms/solid";
import AppLayoutTitle from "@molecules/App/AppLayoutTitle";
import { useContext } from "solid-js";

export default function AccountView() {
	const { c } = useI18n();
	const { user, setUser } = useContext(userContext);
	const [updateForm, { Field, Form }] = createForm<UserUpdateMutationInputSchema>({
		validate: zodForm(schema),
		initialValues: user,
	});

	const handleSubmit: SubmitHandler<UserUpdateMutationInputSchema> = async (values) => {
		const p = client.user.updateCurrent.mutate(values);

		toast.promise(p, {
			loading: { title: c.generic.toasts.saving.loading() },
			success: () => ({ title: c.generic.toasts.saving.success() }),
			error: () => ({ title: c.generic.toasts.saving.error() }),
		});

		const res = await p;
		if (res) setUser("name", res?.name);
	};

	return (
		<div class="flex h-full w-full justify-center overflow-auto p-4">
			<AppLayoutTitle>{c.app.account.title()}</AppLayoutTitle>
			<div class="my-auto w-full max-w-screen-sm rounded-xl border border-pv-blue-200 bg-pv-blue-50 p-5 shadow-lg">
				<Form class="flex flex-col gap-3" onSubmit={handleSubmit}>
					<Field name="name">
						{(field, props) => (
							<Input
								inputProps={props}
								value={field.value}
								required
								label={c.app.account.username()}
								parseResult={schema.shape[field.name].safeParse(field.value)}
								showErrors={!!field.error.length}
								placeholder="Jane Doe"
							/>
						)}
					</Field>
					<Button type="submit" disabled={updateForm.invalid || updateForm.submitting}>
						{c.generic.actions.save()}
					</Button>
				</Form>
			</div>
		</div>
	);
}
