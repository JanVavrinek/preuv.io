import { type ParentProps, Suspense } from "solid-js";

export default function AuthLayout(props: ParentProps) {
	return (
		<main class="grid h-dvh w-dvw place-content-center overflow-auto bg-gradient-to-b from-pv-blue-300 p-5 dark:from-pv-blue-900 dark:to-pv-blue-950">
			<div class="rounded-xl border-2 border-pv-blue-900 bg-pv-blue-50 p-5 shadow-lg">
				<Suspense>{props.children}</Suspense>
			</div>
		</main>
	);
}
