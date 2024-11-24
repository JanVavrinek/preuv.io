import type { ListForm } from "@lib/trpc/routers/form/types";

export type FormProps = {
	form: ListForm;
	onUpdate?: (form: ListForm) => void;
	onDelete?: () => void;
};
