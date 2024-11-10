import Button from "@atoms/Button";
import { Dialog } from "@atoms/Dialog";
import useI18n from "@lib/i18n/hooks/useI18n";
import { type ParentProps, Show, createSignal } from "solid-js";
import type { ConfirmDeleteProps } from "./types";
export default function ConfirmDelete(props: ParentProps<ConfirmDeleteProps>) {
	const { c } = useI18n();
	const [open, setOpen] = createSignal(false);
	return (
		<Dialog
			openTrigger={props.children}
			title={props.title ?? `${c.generic.actions.delete()} ?`}
			slotClasses={{
				content: "max-w-sm",
			}}
			open={open()}
			onOpenChange={setOpen}
		>
			<div class="flex flex-row gap-2 ">
				<Button
					variant="danger"
					onClick={() => {
						setOpen(false);
						props.onConfirm();
					}}
					class="w-full"
				>
					<Show when={props.confirmTitle} fallback={c.generic.actions.delete()}>
						{props.confirmTitle}
					</Show>
				</Button>
				<Button class="w-full" onclick={() => setOpen(false)}>
					{c.generic.actions.close()}
				</Button>
			</div>
		</Dialog>
	);
}
