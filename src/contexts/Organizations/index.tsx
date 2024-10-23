import { client } from "@lib/trpc/client";
import { type ParentProps, createContext, createEffect, on, onMount } from "solid-js";
import { type SetStoreFunction, createStore } from "solid-js/store";
import { LocalStorageKey } from "../../consts";
import type { Organization, Role } from "./types";

type OrganizationsContextData = {
	organizations: { organization: Organization; role: Role }[];
	active?: Organization["id"];
};

const DEFAULT_ORGANIZATIONS_DATA: OrganizationsContextData = {
	organizations: [],
};

const LOAD_LIMIT = 20;

export const organizationsContext = createContext<{
	organizations: OrganizationsContextData;
	setOrganizations: SetStoreFunction<OrganizationsContextData>;
}>({
	organizations: DEFAULT_ORGANIZATIONS_DATA,
	setOrganizations: () => {},
});

export default function OrganizationsProvider(props: ParentProps) {
	const [organizations, setOrganizations] = createStore(structuredClone(DEFAULT_ORGANIZATIONS_DATA));

	function handleLoad(offset = 0) {
		client.organization.getMany.query({ offset, limit: LOAD_LIMIT }).then((res) => {
			if (!organizations.active) setOrganizations("active", res.at(0)?.organization.id);
			setOrganizations("organizations", (s) => [...s, ...res]);
			if (res.length === LOAD_LIMIT) handleLoad(offset + LOAD_LIMIT);
			else {
				const index = organizations.organizations.findIndex((o) => o.organization.id === organizations.active);
				if (index === -1) setOrganizations("active", organizations.organizations.at(0)?.organization.id);
			}
		});
	}

	onMount(() => {
		const active = localStorage.getItem(LocalStorageKey.ACTIVE_ORGANIZATION);
		if (active) setOrganizations("active", active);
		handleLoad();
	});

	createEffect(
		on(
			() => organizations.active,
			(id) => {
				if (id) localStorage.setItem(LocalStorageKey.ACTIVE_ORGANIZATION, id);
				else localStorage.removeItem(LocalStorageKey.ACTIVE_ORGANIZATION);
			},
		),
	);

	return (
		<organizationsContext.Provider value={{ organizations, setOrganizations }}>
			{props.children}
		</organizationsContext.Provider>
	);
}
