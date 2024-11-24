import type { ListCustomer } from "@lib/trpc/routers/customer/types";
import type { JSX } from "solid-js";

export type EditCustomerProps = {
	customer?: ListCustomer;
	openTrigger: JSX.Element;
	onDelete?: () => void;
	onUpdate: (customer: ListCustomer) => void;
};
