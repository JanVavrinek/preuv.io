import { Dialog as KDialog } from "@kobalte/core/dialog";
import { FaSolidXmark } from "solid-icons/fa";
import { Show, createMemo, splitProps } from "solid-js";
import style from "./style.module.css";
import { dialogStyles } from "./styles";
import type { DialogProps } from "./types";

export function Dialog(props: DialogProps) {
	const [variantProps, local] = splitProps(props as DialogProps, ["class", "children", "slotClasses"]);

	const styles = createMemo(() => dialogStyles(variantProps));

	return (
		<KDialog {...local}>
			{props.openTrigger}
			<KDialog.Portal>
				<KDialog.Overlay class={style.dialog__overlay} />
				<div class="fixed inset-0 z-10 flex items-center justify-center p-2">
					<KDialog.Content
						class={styles().content({
							class: [style.dialog__content, variantProps.slotClasses?.content],
						})}
					>
						<div class="flex w-full flex-row items-center justify-between gap-3 rounded-tl-xl rounded-tr-xl border-pv-blue-200 border-b p-3">
							<div class="flex flex-col">
								<Show when={typeof local.title === "string" && local.title} fallback={local.title}>
									<KDialog.Title
										class={styles().title({
											class: [variantProps.slotClasses?.title],
										})}
									>
										{local.title}
									</KDialog.Title>
								</Show>
								<Show when={typeof local.description === "string" && local.description} fallback={local.description}>
									<KDialog.Description
										class={styles().description({
											class: [variantProps.slotClasses?.description],
										})}
									>
										{local.description}
									</KDialog.Description>
								</Show>
							</div>
							<KDialog.CloseButton class="grid h-9 w-9 shrink-0 place-content-center rounded-full transition-all duration-150 hover:bg-pv-blue-100">
								<FaSolidXmark font-size="1.75rem" />
							</KDialog.CloseButton>
						</div>
						<div
							class={styles().contentWrapper({
								class: [variantProps.slotClasses?.contentWrapper],
							})}
						>
							{variantProps.children}
						</div>
					</KDialog.Content>
				</div>
			</KDialog.Portal>
		</KDialog>
	);
}
