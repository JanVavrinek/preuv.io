import { type ParentProps, Suspense } from "solid-js";

export default function AuthLayout(props: ParentProps) {
	return (
		<main class="flex h-dvh w-dvw justify-center overflow-auto bg-pv-blue-100 p-5 dark:bg-pv-blue-900">
			<div class="my-auto w-full max-w-screen-sm rounded-xl border bg-pv-blue-50 p-5 shadow-lg dark:bg-pv-blue-800 dark:shadow-pv-blue-950">
				<Suspense>{props.children}</Suspense>
			</div>
		</main>
	);
}
