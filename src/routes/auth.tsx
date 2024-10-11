import { type ParentProps, Suspense } from "solid-js";

export default function AuthLayout(props: ParentProps) {
	return (
		<main class=" flex h-dvh w-dvw justify-center overflow-auto bg-gradient-to-b from-pv-blue-300 p-5 dark:from-pv-blue-900 dark:to-pv-blue-950">
			<div class="my-auto w-full max-w-screen-sm rounded-xl border-4 border-pv-blue-900 bg-pv-blue-50 p-5 shadow-lg dark:border-pv-blue-950 dark:bg-pv-blue-800 dark:shadow-pv-blue-950">
				<Suspense>{props.children}</Suspense>
			</div>
		</main>
	);
}
