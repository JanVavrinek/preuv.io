import Button from "@atoms/Button";
import PermissionsGuard from "@atoms/PermissionsGuard";
import useHasPermissions from "@atoms/PermissionsGuard/hooks/useHasPermissions";
import { toast } from "@atoms/Toaster";
import Toggle from "@atoms/Toggle";
import useAsync from "@hooks/useAsync";
import { Dialog } from "@kobalte/core/dialog";
import { RolePermissions } from "@lib/db/schemas/role";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import Rating from "@molecules/common/Rating";
import { A } from "@solidjs/router";
import { formatDate } from "@utils/time";
import { BsDot } from "solid-icons/bs";
import { FaSolidGear } from "solid-icons/fa";
import { Show, type VoidProps } from "solid-js";
import EditCustomer from "../../views/Customers/EditCustomer";
import EditTestimonial from "../../views/Testimonials/EditTestimonial";
import { testimonialStyles } from "./styles";
import type { TestimonialProps } from "./types";

export default function Testimonial(props: VoidProps<TestimonialProps>) {
	const { c, locale } = useI18n();
	const check = useHasPermissions();
	const { handler, loading } = useAsync(client.testimonial.update.mutate);

	const handleApprove = async () => {
		if (loading()) return;
		const p = handler({ ...props.testimonial.testimonial, approved: !props.testimonial.testimonial.approved });

		toast.promise(p, {
			loading: { title: c.generic.toasts.saving.loading() },
			success: () => ({ title: c.generic.toasts.saving.success() }),
			error: () => ({ title: c.generic.toasts.saving.error() }),
		});

		props.onUpdate?.(await p);
	};

	return (
		<div class={testimonialStyles().root({ class: [props.class] })}>
			<div class="flex items-center justify-between gap-2">
				<EditCustomer
					openTrigger={
						<Dialog.Trigger
							class="flex w-max flex-col rounded-full p-2 transition-all duration-150 hover:bg-pv-blue-200"
							as="div"
						>
							<p class="leading-none">{props.testimonial.customer.name}</p>
							<Show when={props.testimonial.customer.company}>
								<p class="text-pv-blue-400 text-xs">{props.testimonial.customer.company}</p>
							</Show>
						</Dialog.Trigger>
					}
					onUpdate={() => {}}
					onDelete={() => {}}
					customer={{
						customer: props.testimonial.customer,
						testimonial_count: 0,
						project: props.testimonial.project,
					}}
				/>
				<Toggle
					checked={props.testimonial.testimonial.approved}
					label={c.generic.common.approved()}
					disabled={!check([RolePermissions.TESTIMONIAL_UPDATE]) || loading()}
					onChange={handleApprove}
				/>
			</div>
			<hr class="border-pv-blue-200" />
			<div class="flex flex-col gap-2 py-2">
				<p class="text-lg leading-tight">{props.testimonial.testimonial.text}</p>
				<div class="flex items-center gap-1 text-pv-blue-500 text-xs">
					<Rating value={props.testimonial.testimonial.rating} fontSize="1rem" readonly />
					<BsDot />
					<p>{formatDate(props.testimonial.testimonial.created_at, locale())}</p>
				</div>
			</div>
			<hr class="border-pv-blue-200" />
			<div class="flex flex-wrap items-center justify-between gap-2">
				<A href={`/app/project/${props.testimonial.project.id}`} class="w-max text-pv-navy-500">
					{props.testimonial.project.name}
				</A>
				<div class="flex flex-wrap gap-2">
					<PermissionsGuard permissions={[RolePermissions.TESTIMONIAL_UPDATE]}>
						<EditTestimonial
							onUpdate={(t) => props.onUpdate?.(t)}
							openTrigger={
								<Dialog.Trigger as={Button} icon={<FaSolidGear />}>
									{c.generic.actions.edit()}
								</Dialog.Trigger>
							}
							testimonial={props.testimonial}
						/>
					</PermissionsGuard>
					{props.actionsSlot}
				</div>
			</div>
		</div>
	);
}
