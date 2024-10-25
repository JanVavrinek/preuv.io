import Button from "@atoms/Button";
import { Dialog } from "@atoms/Dialog";
import { Dialog as KDialog } from "@kobalte/core/dialog";
import useI18n from "@lib/i18n/hooks/useI18n";
import type { ParentProps } from "solid-js";
import type { ConfirmDeleteProps } from "./types";
export default function ConfirmDelete(props: ParentProps<ConfirmDeleteProps>) {
	const { c } = useI18n();
	return (
		<Dialog
			openTrigger={props.children}
			title={`${c.generic.actions.delete()} ?`}
			slotClasses={{
				content: "max-w-sm",
			}}
		>
			<div class="flex flex-row gap-2 ">
				<KDialog.CloseButton as={Button} variant="danger" onClick={props.onConfirm} class="w-full">
					{c.generic.actions.delete()}
				</KDialog.CloseButton>
				<KDialog.CloseButton as={Button} class="w-full">
					{c.generic.actions.close()}
				</KDialog.CloseButton>
			</div>
		</Dialog>
	);
}
