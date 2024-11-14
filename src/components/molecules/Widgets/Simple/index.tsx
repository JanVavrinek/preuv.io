import ImageFallback from "@atoms/ImageFallback";
import Rating from "@molecules/common/Rating";
import { For, Show, type VoidProps } from "solid-js";
import type { SimpleWidgetProps } from "./types";

export default function SimpleWidget(props: VoidProps<SimpleWidgetProps>) {
	return (
		<div class="w-full overflow-auto">
			<div class="mx-auto flex w-max grid-flow-col gap-2">
				<For each={props.testimonials}>
					{(t) => (
						<article
							class="flex w-full min-w-60 max-w-72 flex-col gap-2 rounded-lg p-4 shadow-lg"
							style={{
								background: props.options.accent,
							}}
						>
							<div class="flex flex-row items-center gap-2">
								<Show when={props.options.userIcon.show}>
									<div
										class="aspect-square w-12 overflow-hidden"
										style={{
											"border-radius": `${props.options.userIcon.radius}px`,
										}}
									>
										<ImageFallback text={t.customer.name} slotClasses={{ text: "text-xl" }} />
									</div>
								</Show>
								<h2 class="font-bold text-lg">{t.customer.name}</h2>
							</div>
							<p>{t.testimonial.text}</p>
							<div>
								<Rating value={t.testimonial.rating} readonly fontSize="1rem" />
							</div>
						</article>
					)}
				</For>
			</div>
		</div>
	);
}
