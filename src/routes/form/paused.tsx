import useI18n from "@lib/i18n/hooks/useI18n";

export default function FormPausedView() {
	const { c } = useI18n();

	return (
		<main class="flex h-dvh w-dvw justify-center overflow-auto bg-pv-blue-100 p-5">
			<div class="my-auto flex w-full max-w-screen-sm flex-col items-center gap-5 rounded-xl border border-pv-blue-200 bg-pv-blue-50 p-5 text-center shadow-lg">
				<h1 class="font-bold text-2xl text-pv-blue-500">{c.form.paused.title()}</h1>
				<p class="text-pv-blue-400">{c.form.paused.subtitle()}</p>
			</div>
		</main>
	);
}
