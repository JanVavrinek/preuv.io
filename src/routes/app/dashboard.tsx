import Button from "@atoms/Button";
import Input from "@atoms/Input";
import { userContext } from "@contexts/User";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import AppLayoutTitle from "@molecules/App/AppLayoutTitle";
import { createSignal, onMount, useContext } from "solid-js";

export default function DashboardView() {
	const { c } = useI18n();
	const [name, setName] = createSignal("");
	const { user } = useContext(userContext);

	onMount(() => {
		client.user.getCurrent.query().then((res) => setName(res.name));
	});

	const handleSave = () => {
		client.user.updateCurrent.mutate({ name: name() }).then((res) => {
			setName(res?.name ?? "");
		});
	};

	return (
		<>
			<AppLayoutTitle>{c.app.dashboard.title()}</AppLayoutTitle>
			<Input value={name()} onChange={setName} />
			<Button onclick={handleSave}>Save</Button>
		</>
	);
}
// @collection.roles:auth.organization ?= id && @collection.roles:auth.id ?= @collection.members.role
