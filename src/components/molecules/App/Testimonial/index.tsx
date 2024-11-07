import { Dialog } from "@kobalte/core/dialog";
import useI18n from "@lib/i18n/hooks/useI18n";
import Rating from "@molecules/common/Rating";
import { A } from "@solidjs/router";
import { formatDate } from "@utils/time";
import { BsDot } from "solid-icons/bs";
import { Show, type VoidProps } from "solid-js";
import EditCustomer from "../views/Customers/EditCustomer";
import type { TestimonialProps } from "./types";

export default function Testimonial(props: VoidProps<TestimonialProps>) {
	const { locale } = useI18n();
	return (
		<div class="flex w-full flex-col gap-1 rounded-xl border border-pv-blue-200 bg-pv-blue-100 p-3">
			<EditCustomer
				openTrigger={
					<Dialog.Trigger
						class="flex w-max flex-col rounded-full p-2 transition-all duration-150 hover:bg-pv-blue-200"
						as="div"
					>
						<p class="leading-none">{props.customer.name}</p>
						<Show when={props.customer.company}>
							<p class="text-pv-blue-400 text-xs">{props.customer.company}</p>
						</Show>
					</Dialog.Trigger>
				}
				onUpdate={() => {}}
				onDelete={() => {}}
				customer={{
					customer: props.customer,
					testimonial_count: 0,
					project: props.project,
				}}
			/>
			<hr class="border-pv-blue-200" />
			<div class="flex flex-col gap-2 py-2">
				<p class="text-lg leading-tight">{props.testimonial.text}</p>
				<div class="flex items-center gap-1 text-pv-blue-500 text-xs">
					<Rating value={props.testimonial.rating} fontSize="1rem" readonly />
					<BsDot />
					<p>{formatDate(props.testimonial.created_at, locale())}</p>
				</div>
			</div>
			<hr class="border-pv-blue-200" />
			<A href={`/app/project/${props.project.id}`} class="w-max text-pv-navy-500">
				{props.project.name}
			</A>
		</div>
	);
}
