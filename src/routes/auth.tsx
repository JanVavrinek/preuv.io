import { Alert } from "@atoms/Alert";
import useI18n from "@lib/i18n/hooks/useI18n";
import { FaSolidExclamation } from "solid-icons/fa";
import { type ParentProps, Suspense } from "solid-js";

export default function AuthLayout(props: ParentProps) {
	const { c } = useI18n();
	return (
		<main class="flex h-dvh w-dvw justify-center overflow-auto bg-pv-blue-100 p-5">
			<div class="my-auto w-full max-w-screen-sm rounded-xl border border-pv-blue-200 bg-pv-blue-50 p-5 shadow-lg">
				<Suspense>{props.children}</Suspense>
				<Alert icon={<FaSolidExclamation />} variant="danger" class="mt-4">
					{c.auth.demo()}
				</Alert>
			</div>
		</main>
	);
}
