import Dropdown from "@atoms/Dropdown";
import { appLayoutTitleContext } from "@contexts/AppLayoutTitle";
import { userContext } from "@contexts/User";
import useI18n from "@lib/i18n/hooks/useI18n";
import { FaSolidUser } from "solid-icons/fa";
import { useContext } from "solid-js";
import useSignOut from "../../../../hooks/useSignOut";
import Invites from "./components/Invites";

export default function Header() {
	const { c } = useI18n();
	const { title } = useContext(appLayoutTitleContext);
	const { user } = useContext(userContext);
	const signOut = useSignOut();

	return (
		<header class="sticky top-0 flex flex-row items-center justify-between bg-pv-blue-100 bg-opacity-50 p-4 backdrop-blur-sm">
			<h1 class="font-bold text-pv-blue-500 text-xl md:text-2xl">{title()}</h1>
			<div class="flex items-center gap-4">
				<Invites />
				<Dropdown
					items={[
						{
							label: c.app.account.title(),
							href: "/app/account",
						},
						{
							label: <p class="text-pv-red-500">{c.app.header.signOut()}</p>,
							onSelect: signOut,
						},
					]}
				>
					<div class="flex items-center gap-2">
						<FaSolidUser font-size="1.5rem" />
						<p class="text-lg">{user.name}</p>
					</div>
				</Dropdown>
			</div>
		</header>
	);
}
