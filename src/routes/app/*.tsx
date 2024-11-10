import Button from "@atoms/Button";
import useI18n from "@lib/i18n/hooks/useI18n";
import AppLayoutTitle from "@molecules/App/AppLayoutTitle";
import { A } from "@solidjs/router";
import { HttpStatusCode } from "@solidjs/start";
import { FaSolidArrowLeft } from "solid-icons/fa";

export default function FallBackView() {
	const { c } = useI18n();
	return (
		<div class="flex w-full flex-grow justify-center p-4">
			<AppLayoutTitle>404</AppLayoutTitle>
			<div class="my-auto flex flex-col items-center gap-4">
				<p class="text-center text-3xl text-pv-blue-500">{c.app.fallback.text()}</p>
				<Button as={A} href="/app/dashboard" icon={<FaSolidArrowLeft />}>
					{c.app.fallback.back()}
				</Button>
			</div>
			<HttpStatusCode code={404} />
		</div>
	);
}
