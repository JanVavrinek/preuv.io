import { type JSX, type ParentProps, createContext } from "solid-js";
import { type SetStoreFunction, createStore } from "solid-js/store";

type ContextData = { title: string; label?: JSX.Element };

export const appLayoutTitleContext = createContext<{
	setTitle: SetStoreFunction<ContextData>;
	title: ContextData;
}>({
	title: { title: "" },
	setTitle: () => {},
});

export function AppLayoutTitleProvider(props: ParentProps) {
	const [title, setTitle] = createStore<ContextData>({ title: "" });
	return <appLayoutTitleContext.Provider value={{ title, setTitle }}>{props.children}</appLayoutTitleContext.Provider>;
}
