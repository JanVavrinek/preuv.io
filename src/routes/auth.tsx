import { GridPattern } from "@atoms/GridPattern";
import { A } from "@solidjs/router";
import { type ParentProps, Suspense } from "solid-js";

export default function AuthLayout(props: ParentProps) {
	return (
		<div class="h-dvh w-dvw overflow-auto">
			<main class="relative z-0 flex min-h-full w-full flex-col items-center gap-12 bg-pv-blue-100 p-5">
				<GridPattern
					class="-z-[1] animate-pulse [animation-duration:_6s] [mask-image:radial-gradient(transparent,white)]"
					strokeDasharray="4"
				/>
				<A href="/" class="mt-auto text-center text-4xl text-pv-blue-300">
					preuv.io
				</A>
				<div class="mb-auto w-full max-w-screen-sm rounded-xl border border-pv-blue-200 bg-pv-blue-50 p-5 shadow-lg ">
					<Suspense>{props.children}</Suspense>
				</div>
			</main>
		</div>
	);
}
