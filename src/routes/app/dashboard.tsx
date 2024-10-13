import Button from "@atoms/Button";
import { client } from "@lib/trpc/client";

export default function DashboardView() {
	const handleClick = () => {
		client.user.getTest.query().then(console.log);
	};

	return (
		<>
			Dashboard
			<Button onclick={handleClick}>click </Button>
		</>
	);
}
// @collection.roles:auth.organization ?= id && @collection.roles:auth.id ?= @collection.members.role
