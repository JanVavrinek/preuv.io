import Button from "@atoms/Button";
import Input from "@atoms/Input";
import { toast } from "@atoms/Toaster";
import useI18n from "@lib/i18n/hooks/useI18n";
import { type LoginSchema, loginSchema } from "@lib/schemas/routes/auth";
import supabase from "@lib/supabase";
import { type SubmitHandler, createForm, zodForm } from "@modular-forms/solid";
import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import type { AuthResponse } from "@supabase/supabase-js";

export default function SignUpView() {
	const { c } = useI18n();
	const [signUpForm, { Form, Field }] = createForm<LoginSchema>({
		validate: zodForm(loginSchema),
	});

	const handleSubmit: SubmitHandler<LoginSchema> = async (values) => {
		const p = new Promise<AuthResponse["data"]>((res, rej) => {
			supabase.auth
				.signUp({
					email: values.email,
					password: values.password,
					options: {
						emailRedirectTo: import.meta.env.VITE_EMAIL_CONFIRM_REDIRECT,
					},
				})
				.then((data) => {
					if (data.error) rej(data.error.status);
					else res(data.data);
				});
		});
		toast.promise<number>(p, {
			loading: { title: c.auth.signUp.toasts.signUp.loading() },
			error: (e) => ({ title: c.auth.signUp.toasts.signUp.error(e ?? 0) }),
			success: () => ({ title: c.auth.signUp.toasts.signUp.success() }),
		});
	};

	return (
		<div class="flex flex-col gap-5">
			<Title>{c.auth.signUp.title()}</Title>
			<h1 class="font-bold text-4xl">{c.auth.signUp.title()}</h1>
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
							placeholder="jane@preuv.io"
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
				<Button disabled={signUpForm.invalid} type="submit">
					{c.auth.signUp.title()}
				</Button>
			</Form>
			<A class="flex justify-center gap-1 p-1" href="/auth/signin">
				{c.auth.signUp.haveAccount()}
				<span class="font-semibold text-pv-navy-500">{c.auth.signIn.title()}</span>
			</A>
		</div>
	);
}
