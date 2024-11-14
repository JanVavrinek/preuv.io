import Button from "@atoms/Button";
import useI18n from "@lib/i18n/hooks/useI18n";
import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { FaSolidArrowRight } from "solid-icons/fa";
import { version } from "./../../package.json";

export default function Home() {
	const { c } = useI18n();
	return (
		<main class="relative flex h-dvh w-dvw flex-col overflow-auto bg-pv-blue-100">
			<Title>preuv.io</Title>
			<header class="sticky top-0 z-10 flex flex-row items-center justify-between border-pv-blue-200 border-b bg-pv-blue-100 bg-opacity-70 p-4 backdrop-blur-sm">
				<p class="text-pv-blue-400 text-xl">
					preuv.io <span class="rounded-full bg-pv-blue-200 px-2 py-1 text-xs">{version}</span>
				</p>
				<Button
					icon={<FaSolidArrowRight />}
					class="flex-row-reverse"
					slotClasses={{ icon: "mr-0 ml-2" }}
					as={A}
					href="/auth/signin"
				>
					{c.auth.signIn.title()}
				</Button>
			</header>
			<div class="flex w-full flex-grow p-5">
				<div class="my-auto flex w-full flex-col items-center gap-8">
					<h1 class="text-center text-4xl text-pv-blue-500 transition-all duration-200 md:text-6xl">
						{c.landing.title()}
					</h1>
					<div class="flex w-max flex-col gap-2 sm:flex-row">
						<Button as={A} href="/auth/signup" class="min-w-64" variant="success">
							{c.auth.signUp.title()}
						</Button>
						<Button as={A} href="/auth/signin" class="min-w-64">
							{c.auth.signIn.title()}
						</Button>
					</div>
				</div>
			</div>
			<div class="flex justify-center">
				<Button as="a" href="https://preuv.io/form/preuvio-landing" class="min-w-64" target="_blank">
					{c.landing.testimonial()}
				</Button>
			</div>
			<div class="p-5">
				<iframe
					src="https://preuv.io/widget/84c6dea2-ebf9-446a-ae80-881801142e0f"
					title="Landing Page"
					class="h-60 w-full"
				/>
			</div>
		</main>
	);
}
