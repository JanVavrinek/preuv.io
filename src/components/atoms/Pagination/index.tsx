import Button from "@atoms/Button";
import { Pagination as KPagination } from "@kobalte/core/pagination";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { FaSolidAngleLeft, FaSolidAngleRight } from "solid-icons/fa";
import { type ValidComponent, splitProps } from "solid-js";
import { paginationStyles } from "./styles";
import type { PaginationProps } from "./types";
export default function Pagination<T extends ValidComponent = "nav">(
	props: PolymorphicProps<T, Omit<PaginationProps<T>, "itemComponent" | "ellipsisComponent">>,
) {
	const [local, other] = splitProps(props as Omit<PaginationProps, "itemComponent" | "ellipsisComponent">, ["class"]);

	return (
		<KPagination
			{...other}
			itemComponent={(item) => (
				<KPagination.Item
					page={item.page}
					class="hover:-translate-y-1 grid h-12 w-12 place-content-center rounded-full border border-pv-blue-200 transition-all delay-150 duration-150 hover:bg-pv-blue-100 hover:shadow-lg data-[current]:bg-pv-navy-400 data-[current]:text-white"
				>
					{item.page}
				</KPagination.Item>
			)}
			ellipsisComponent={() => <KPagination.Ellipsis as={Button}>...</KPagination.Ellipsis>}
			fixedItems="no-ellipsis"
			class={paginationStyles().root({
				class: local.class,
			})}
		>
			<KPagination.Previous as={Button}>
				<FaSolidAngleLeft />
			</KPagination.Previous>
			<KPagination.Items />
			<KPagination.Next as={Button}>
				<FaSolidAngleRight />
			</KPagination.Next>
		</KPagination>
	);
}
