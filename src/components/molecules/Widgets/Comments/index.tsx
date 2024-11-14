import ImageFallback from "@atoms/ImageFallback";
import Rating from "@molecules/common/Rating";
import { FaSolidQuoteLeft, FaSolidQuoteRight } from "solid-icons/fa";
import { For, Show, type VoidProps } from "solid-js";
import type { CommentsWidgetProps } from "./types";

export default function CommentsWidget(props: VoidProps<CommentsWidgetProps>) {
	return (
		<div class="flex flex-col gap-4">
			<For each={props.testimonials}>
				{(t) => (
					<article class="flex flex-row flex-wrap items-center gap-6">
						<div
							class="aspect-square w-12 overflow-hidden"
							style={{
								"border-radius": `${props.options.userIcon.radius}px`,
							}}
						>
							<ImageFallback text={t.customer.name} slotClasses={{ text: "text-xl" }} />
						</div>
						<div
							class="flex w-full max-w-72 flex-col gap-2 rounded-lg p-4 shadow-lg"
							style={{
								background: props.options.accent,
							}}
						>
							<div class="flex gap-1">
								<Show when={props.options.quotes.show}>
									<FaSolidQuoteLeft
										size={props.options.quotes.size}
										style={{ color: props.options.quotes.accent }}
										class="flex-shrink-0"
									/>
								</Show>
								<p>{t.testimonial.text}</p>
								<Show when={props.options.quotes.show}>
									<FaSolidQuoteRight
										size={props.options.quotes.size}
										style={{ color: props.options.quotes.accent }}
										class="flex-shrink-0 self-end"
									/>
								</Show>
							</div>
							<Rating value={t.testimonial.rating} readonly fontSize="1rem" />
						</div>
					</article>
				)}
			</For>
		</div>
	);
}
