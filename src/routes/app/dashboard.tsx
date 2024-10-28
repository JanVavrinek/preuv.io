import Button from "@atoms/Button";
import Combobox from "@atoms/Combobox";
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
	const [value, setValue] = createSignal("");

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
			{value()}
			<div class="p-5">
				<Combobox
					options={[
						{
							label: "label",
							value: "value",
						},
					]}
					onChange={() => {}}
					label="Label"
					onInputChange={setValue}
				/>
			</div>
		</>
	);
}
// @collection.roles:auth.organization ?= id && @collection.roles:auth.id ?= @collection.members.role
