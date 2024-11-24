import Button from "@atoms/Button";
import { Dialog } from "@kobalte/core/dialog";
import useI18n from "@lib/i18n/hooks/useI18n";
import ConfirmDelete from "@molecules/common/ConfirmDelete";
import Testimonial from "@molecules/layouts/App/common/Testimonial";
import AddTestimonial from "@molecules/layouts/App/views/Widget/components/AddTestimonial";
import widgetContext from "@molecules/layouts/App/views/Widget/context/Widget";
import { FaSolidPlus, FaSolidXmark } from "solid-icons/fa";
import { For, useContext } from "solid-js";

export default function WidgetTestimonialsView() {
	const { c } = useI18n();
	const { testimonials, setTestimonials } = useContext(widgetContext);
	return (
		<>
			<div class="flex flex-grow flex-col gap-2 p-5">
				<For
					each={testimonials()}
					fallback={
						<p class="py-4 text-center font-semibold text-pv-blue-500">
							{c.app.widget.detail.testimonial.noSelected()}
						</p>
					}
				>
					{(t) => (
						<Testimonial
							testimonial={t}
							onUpdate={(v) => setTestimonials((s) => s.map((i) => (i.testimonial.id === v.testimonial.id ? v : i)))}
							actionsSlot={
								<ConfirmDelete
									onConfirm={() => setTestimonials((s) => s.filter((i) => i.testimonial.id !== t.testimonial.id))}
									confirmTitle={c.generic.actions.remove()}
									title={`${c.generic.actions.remove()} ?`}
								>
									<Dialog.Trigger as={Button} variant="danger" icon={<FaSolidXmark />}>
										{c.generic.actions.remove()}
									</Dialog.Trigger>
								</ConfirmDelete>
							}
						/>
					)}
				</For>
			</div>
			<div class="sticky bottom-0 rounded-b-xl border-pv-blue-200 border-t bg-pv-blue-50 bg-opacity-70 p-5 backdrop-blur-md">
				<AddTestimonial>
					<Dialog.Trigger as={Button} icon={<FaSolidPlus />}>
						{c.app.widget.detail.testimonial.add()}
					</Dialog.Trigger>
				</AddTestimonial>
			</div>
		</>
	);
}
