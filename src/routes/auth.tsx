import { Alert } from "@atoms/Alert";
import useI18n from "@lib/i18n/hooks/useI18n";
import { A } from "@solidjs/router";
import { FaSolidExclamation } from "solid-icons/fa";
import { type ParentProps, Suspense } from "solid-js";

export default function AuthLayout(props: ParentProps) {
	const { c } = useI18n();
	return (
		<main class="flex h-dvh w-dvw flex-col items-center gap-12 overflow-auto bg-pv-blue-100 p-5">
			<A href="/" class="mt-auto text-center text-4xl text-pv-blue-300">
				preuv.io
			</A>
			<div class=" mb-auto w-full max-w-screen-sm rounded-xl border border-pv-blue-200 bg-pv-blue-50 p-5 shadow-lg ">
				<Suspense>{props.children}</Suspense>
				<Alert
					icon={<FaSolidExclamation />}
					variant="danger"
					class="mt-4"
					slotClasses={{
						icon: "animate-pulse",
					}}
				>
					{c.auth.demo()}
				</Alert>
			</div>
		</main>
	);
}
