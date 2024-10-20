import {
	type Accessor,
	type ParentProps,
	type Setter,
	createContext,
	createSignal,
} from "solid-js";

export const appLayoutTitleContext = createContext<{
	setTitle: Setter<string>;
	title: Accessor<string>;
}>({
	title: () => "",
	setTitle: () => {},
});

export function AppLayoutTitleProvider(props: ParentProps) {
	const [title, setTitle] = createSignal("");
	return (
		<appLayoutTitleContext.Provider value={{ title, setTitle }}>
			{props.children}
		</appLayoutTitleContext.Provider>
	);
}
