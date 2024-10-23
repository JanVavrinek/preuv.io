import { client } from "@lib/trpc/client";
import { useLocation, useNavigate } from "@solidjs/router";
import { type ParentProps, Show, createContext, onMount } from "solid-js";
import { type SetStoreFunction, createStore } from "solid-js/store";
import type { User } from "./types";

const EMPTY_USER: User = {
	id: "",
	name: "",
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
	const navigate = useNavigate();
	const location = useLocation();

	onMount(async () => {
		let foundUser: User | undefined = undefined;
		try {
			foundUser = await client.user.getCurrent.query();
		} catch {
			try {
				foundUser = await client.user.createCurrent.mutate();
			} catch {
				navigate(`/auth/signin?return_path=${encodeURIComponent(location.pathname)}`);
			}
		}
		if (foundUser) setUser(foundUser);
	});

	return (
		<userContext.Provider value={{ user, setUser }}>
			<Show when={user.id.length}>{props.children}</Show>
		</userContext.Provider>
	);
}
