import Button from "@atoms/Button";
import { Dialog } from "@atoms/Dialog";
import { toast } from "@atoms/Toaster";
import { Dialog as KDialog } from "@kobalte/core/dialog";
import useI18n from "@lib/i18n/hooks/useI18n";
import { FaSolidShare } from "solid-icons/fa";
import { createMemo, useContext } from "solid-js";
import widgetContext from "../../context/Widget";

export default function Share() {
	const { c } = useI18n();
	const { widget } = useContext(widgetContext);

	const code = createMemo(() => {
		return `<iframe src="${import.meta.env.VITE_BASE_URL}/widget/${widget.widget.id}" title="${widget.widget.name}"></iframe>`;
	});

	const handleCopy = () => {
		window.navigator.clipboard.writeText(code());
		toast.show(c.generic.common.clipboard());
	};

	return (
		<Dialog
			openTrigger={
				<KDialog.Trigger as={Button} icon={<FaSolidShare />} class="w-full">
					{c.generic.actions.share()}
				</KDialog.Trigger>
			}
			title={c.app.widget.detail.design.editor.share.title()}
			slotClasses={{
				contentWrapper: "flex flex-col gap-4",
			}}
		>
			<p class="font-semibold text-pv-blue-500">{c.app.widget.detail.design.editor.share.description()}</p>
			<pre class="w-full rounded-xl border border-pv-blue-200 bg-pv-blue-100 p-3 font-mono text-pv-blue-600">
				<code class="w-full text-wrap">{code()}</code>
			</pre>
			<Button onclick={handleCopy}>{c.generic.actions.copy()}</Button>
		</Dialog>
	);
}
