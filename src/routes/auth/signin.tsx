import Button from "@atoms/Button";
import Input from "@atoms/Input";
import { toast } from "@atoms/Toaster";
import useI18n from "@lib/i18n/hooks/useI18n";
import { type LoginSchema, loginSchema } from "@lib/schemas/routes/auth";
import supabase from "@lib/supabase";
import { type SubmitHandler, createForm, zodForm } from "@modular-forms/solid";
import { Title } from "@solidjs/meta";
import { A, useNavigate, useSearchParams } from "@solidjs/router";
import type { AuthTokenResponsePassword } from "@supabase/supabase-js";

export default function SignInView() {
	const { c } = useI18n();
	const navigate = useNavigate();
	const [loginForm, { Form, Field }] = createForm<LoginSchema>({
		validate: zodForm(loginSchema),
	});
	const [params] = useSearchParams<{ return_path?: string }>();

	const handleSubmit: SubmitHandler<LoginSchema> = async (values) => {
		const p = new Promise<AuthTokenResponsePassword["data"]>((res, rej) => {
			supabase.auth
				.signInWithPassword({
					email: values.email,
					password: values.password,
				})
				.then((data) => {
					if (data.error) rej(data.error.status);
					else res(data.data);
				});
		});
		toast.promise<number>(p, {
			loading: { title: c.auth.signIn.toasts.sigIn.loading() },
			success: () => ({ title: c.auth.signIn.toasts.sigIn.success() }),
			error: (e) => ({ title: c.auth.signIn.toasts.sigIn.error(e ?? 0) }),
		});
		p.then(() => navigate(params.return_path ?? "/app/dashboard"));
	};

	return (
		<div class="flex flex-col gap-5">
			<Title>{c.auth.signIn.title()}</Title>
			<h1 class="font-bold text-4xl">{c.auth.signIn.title()}</h1>
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
							type="email"
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
							placeholder="*********"
							parseResult={loginSchema.shape[field.name].safeParse(field.value)}
							showErrors={!!field.error.length}
						/>
					)}
				</Field>

				<Button disabled={loginForm.invalid} type="submit">
					Sign In
				</Button>
			</Form>
			<A class="mx-auto w-max p-1 text-center" href="/auth/signup">
				{c.auth.signIn.noAccount()} <span class="font-semibold text-pv-navy-500">{c.auth.signUp.title()}</span>
			</A>
		</div>
	);
}
