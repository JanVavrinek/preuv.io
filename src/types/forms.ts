import type { FieldValues, FormProps } from "@modular-forms/solid";
import type { ComponentProps, JSX } from "solid-js";

export type FormSubmitHandler<T extends (props: Omit<FormProps<FieldValues, undefined>, "of">) => JSX.Element> =
	ComponentProps<T>["onSubmit"];
