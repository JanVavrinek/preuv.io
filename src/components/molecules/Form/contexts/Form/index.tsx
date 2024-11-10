import { formSubmitActionSchema } from "@lib/server/routes/form";
import { type ParentProps, createContext } from "solid-js";
import { type SetStoreFunction, createStore } from "solid-js/store";
import type { z } from "zod";

export const formContextDataSchema = formSubmitActionSchema.shape.data;

type FormContextData = z.infer<typeof formContextDataSchema>;

const EMPTY_DATA: FormContextData = {
	testimonial: {
		rating: 1,
		text: "",
	},
	customer: {
		email: "",
		name: "",
		company: "",
		title: "",
		url: "",
	},
};

const formContext = createContext<{ data: FormContextData; setData: SetStoreFunction<FormContextData> }>({
	data: EMPTY_DATA,
	setData: () => {},
});

export function FormContextProvider(props: ParentProps) {
	const [data, setData] = createStore<FormContextData>(structuredClone(EMPTY_DATA));
	return <formContext.Provider value={{ data, setData }}>{props.children}</formContext.Provider>;
}

export default formContext;
