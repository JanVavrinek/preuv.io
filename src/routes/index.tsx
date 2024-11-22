import Button from "@atoms/Button";
import { GridPattern } from "@atoms/GridPattern";
import useI18n from "@lib/i18n/hooks/useI18n";
import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { FaSolidArrowRight } from "solid-icons/fa";
import { version } from "./../../package.json";

export default function Home() {
	const { c } = useI18n();
	return (
		<div class="h-dvh w-dvw overflow-auto">
			<main class="relative z-0 flex min-h-full w-full flex-col overflow-auto bg-pv-blue-100">
				<GridPattern
					class="-z-[1] animate-pulse [animation-duration:_6s] [mask-image:radial-gradient(transparent,white)]"
					strokeDasharray="4"
				/>
				<Title>preuv.io</Title>
				<header class="sticky top-0 z-10 flex flex-row items-center justify-between border-pv-blue-200 border-b bg-pv-blue-100/10 bg-opacity-70 p-4 backdrop-blur-sm">
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
				<div class="flex w-full flex-grow justify-center p-5">
					<div class="my-auto flex w-max flex-col items-center gap-8 rounded-2xl p-5">
						<h1 class="text-center font-black text-4xl text-pv-blue-500 transition-all duration-200 md:text-6xl">
							{c.landing.title()}
						</h1>
						<h2 class="text-center text-pv-blue-400 text-xl transition-all duration-200">{c.landing.subtitle()}</h2>
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
			</main>
		</div>
	);
}
