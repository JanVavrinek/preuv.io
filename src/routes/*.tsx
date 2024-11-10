import useI18n from "@lib/i18n/hooks/useI18n";
import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";

export default function FallbackView() {
	const { c } = useI18n();
	return (
		<div class="flex w-full flex-grow justify-center p-4">
			<Title>404</Title>
			<div class="my-auto flex flex-col items-center gap-4">
				<p class="text-center text-3xl text-pv-blue-500">{c.app.fallback.text()}</p>
			</div>
			<HttpStatusCode code={404} />
		</div>
	);
}
