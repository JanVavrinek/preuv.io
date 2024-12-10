import supabase from "@lib/supabase";
import { client } from "@lib/trpc/client";
import { useLocation, useNavigate } from "@solidjs/router";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { type Accessor, type ParentProps, Show, createContext, createSignal, onMount } from "solid-js";
import { type SetStoreFunction, createStore } from "solid-js/store";
import type { User } from "./types";

const EMPTY_USER: User = {
	id: "",
	name: "",
};

export const userContext = createContext<{
	user: User;
	setUser: SetStoreFunction<User>;
	channel: Accessor<RealtimeChannel | undefined>;
}>({
	user: EMPTY_USER,
	setUser: () => {},
	channel: () => undefined,
});

export default function UserProvider(props: ParentProps) {
	const [user, setUser] = createStore<User>({ ...EMPTY_USER });
	const [channel, setChannel] = createSignal<RealtimeChannel>();
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
		if (foundUser) {
			setUser(foundUser);

			const c = supabase.channel(foundUser.id, { config: { private: true, broadcast: { self: true } } });

			c.subscribe((status) => {
				if (status !== "SUBSCRIBED") return;
				setChannel(c);
			});
		}
	});

	return (
		<userContext.Provider value={{ user, setUser, channel }}>
			<Show when={user.id.length}>{props.children}</Show>
		</userContext.Provider>
	);
}
