import Skeleton from "@atoms/Skeleton";
import { BsDot } from "solid-icons/bs";

export default function TestimonialSkeleton() {
	return (
		<div class="flex w-full flex-col gap-1 rounded-xl border border-pv-blue-200 bg-pv-blue-100 p-3">
			<Skeleton class="!w-max" radius={10}>
				<p class="leading-none">customer name</p>
			</Skeleton>

			<hr class="border-pv-blue-200" />
			<div class="py-2">
				<Skeleton height={15} radius={10} />
				<Skeleton height={15} class="mt-1" radius={10} />
				<Skeleton height={15} class="mt-1" radius={10} />
				<div class="mt-2 flex items-center gap-1">
					<Skeleton width={120} height={15} radius={10} />
					<BsDot />
					<Skeleton width={120} height={15} radius={10} />
				</div>
			</div>
			<hr class="border-pv-blue-200" />
			<Skeleton class="!w-max" radius={10}>
				<p>project name placeholder</p>
			</Skeleton>
		</div>
	);
}
