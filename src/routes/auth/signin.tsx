import Button from "@atoms/Button";
import Input from "@atoms/Input";
import { toast } from "@atoms/Toaster";
import useI18n from "@lib/i18n/hooks/useI18n";
import { pb } from "@lib/pocketbase";
import { type LoginSchema, loginSchema } from "@lib/schemas/routes/auth";
import { type SubmitHandler, createForm, zodForm } from "@modular-forms/solid";
import { Title } from "@solidjs/meta";

export default function SignInView() {
	const { c } = useI18n();
	const [loginForm, { Form, Field }] = createForm<LoginSchema>({
		validate: zodForm(loginSchema),
	});

	const handleSubmit: SubmitHandler<LoginSchema> = async (values) => {
		const p = pb
			.collection("users")
			.authWithPassword(values.email, values.password);

		toast.promise(p, {
			loading: { title: c.auth.signIn.toasts.sigIn.loading() },
			success: () => ({ title: c.auth.signIn.toasts.sigIn.success() }),
			error: () => ({ title: c.auth.signIn.toasts.sigIn.error() }),
		});
	};

	return (
		<div class="flex flex-col gap-5">
			<Title>{c.auth.signIn.title()}</Title>
			<h1 class="font-bold text-4xl dark:text-pv-blue-400">
				{c.auth.signIn.title()}
			</h1>
			<Form onSubmit={handleSubmit} class="flex flex-col gap-2">
				<Field name="email">
					{(field, props) => (
						<Input
							inputProps={props}
							value={field.value}
							required
							label={c.auth.signIn.email()}
							parseResult={loginSchema.shape[field.name].safeParse(field.value)}
							showErrors={!!field.error.length}
							placeholder="jane@doe.com"
						/>
					)}
				</Field>
				<Field name="password">
					{(field, props) => (
						<Input
							inputProps={props}
							value={field.value}
							required
							type="password"
							label={c.auth.signIn.password()}
							placeholder="***"
							parseResult={loginSchema.shape[field.name].safeParse(field.value)}
							showErrors={!!field.error.length}
						/>
					)}
				</Field>

				<Button disabled={loginForm.invalid} type="submit">
					Sign In
				</Button>
			</Form>
		</div>
	);
}
