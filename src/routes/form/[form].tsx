import { getForm } from "@lib/server/routes/form";
import Customer from "@molecules/Form/Steps/Customer";
import Testimonial from "@molecules/Form/Steps/Testimonial";
import ThankYou from "@molecules/Form/Steps/ThankYou";
import Welcome from "@molecules/Form/Steps/Welcome";
import { FormContextProvider } from "@molecules/Form/contexts/Form";
import { Title } from "@solidjs/meta";
import { type RouteDefinition, createAsync, useParams } from "@solidjs/router";
import { Match, Show, Switch, createSignal } from "solid-js";

export const route = {
	preload: ({ params }) => getForm(params.form),
} satisfies RouteDefinition;

enum FormSteps {
	WELCOME = 0,
	TESTIMONIAL = 1,
	CUSTOMER = 2,
	THANK_YOU = 3,
}

export default function FormView() {
	const params = useParams<{ form: string }>();
	const form = createAsync(() => getForm(params.form));
	const [step, setStep] = createSignal(FormSteps.WELCOME);

	return (
		<FormContextProvider>
			<main class="flex h-dvh w-dvw justify-center overflow-auto bg-pv-blue-100 p-5">
				<div class="my-auto flex w-full max-w-screen-sm flex-col items-center gap-5 rounded-xl border border-pv-blue-200 bg-pv-blue-50 p-5 shadow-lg">
					<Show when={form()} keyed>
						{(f) => (
							<>
								<Title>{f.project}</Title>
								<Switch
									fallback={
										<Welcome onNext={() => setStep(FormSteps.TESTIMONIAL)} project={f.project} text={f.welcome} />
									}
								>
									<Match when={step() === FormSteps.TESTIMONIAL}>
										<Testimonial onBack={() => setStep(FormSteps.WELCOME)} onNext={() => setStep(FormSteps.CUSTOMER)} />
									</Match>
									<Match when={step() === FormSteps.CUSTOMER}>
										<Customer
											onBack={() => setStep(FormSteps.TESTIMONIAL)}
											onNext={() => setStep(FormSteps.THANK_YOU)}
										/>
									</Match>
									<Match when={step() === FormSteps.THANK_YOU}>
										<ThankYou text={f.thankyou} />
									</Match>
								</Switch>
							</>
						)}
					</Show>
				</div>
			</main>
		</FormContextProvider>
	);
}
