import { type ParentProps, createContext } from "solid-js";
import { type SetStoreFunction, createStore } from "solid-js/store";
import type { User } from "./types";

const EMPTY_USER: User = {
	email: "",
	username: "",
};

export const userContext = createContext<{
	user: User;
	setUser: SetStoreFunction<User>;
}>({
	user: EMPTY_USER,
	setUser: () => {},
});

export default function UserProvider(props: ParentProps) {
	const [user, setUser] = createStore<User>({ ...EMPTY_USER });

	return (
		<userContext.Provider value={{ user, setUser }}>
			{props.children}
		</userContext.Provider>
	);
}
