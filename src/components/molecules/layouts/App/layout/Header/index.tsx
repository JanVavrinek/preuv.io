import Dropdown from "@atoms/Dropdown";
import { appLayoutTitleContext } from "@contexts/AppLayoutTitle";
import { userContext } from "@contexts/User";
import { Button } from "@kobalte/core/button";
import useI18n from "@lib/i18n/hooks/useI18n";
import { FaSolidUser } from "solid-icons/fa";
import { RiSystemMenu4Line } from "solid-icons/ri";
import { Show, type VoidProps, useContext } from "solid-js";
import useSignOut from "../../../../../../hooks/useSignOut";
import Invites from "./components/Invites";
import type { HeaderProps } from "./types";

export default function Header(props: VoidProps<HeaderProps>) {
	const { c } = useI18n();
	const { title } = useContext(appLayoutTitleContext);
	const { user } = useContext(userContext);
	const signOut = useSignOut();

	return (
		<header class="sticky top-0 z-10 flex flex-row items-center justify-between border-pv-blue-200 border-b bg-pv-blue-100 bg-opacity-70 p-4 backdrop-blur-sm">
			<div class="flex items-center gap-2">
				<Button class="p-2" onclick={props.onOpenSideBar}>
					<RiSystemMenu4Line class="text-2xl lg:hidden" />
				</Button>
				<div class="flex items-center gap-1">
					<h1 class="font-bold text-pv-blue-500 text-xl md:text-2xl">{title.title}</h1>
					<Show when={title.label !== undefined}>
						<div class="rounded-full bg-pv-blue-200 px-2 py-1 text-pv-blue-500 text-xs">{title.label}</div>
					</Show>
				</div>
			</div>
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
					class="bg-pv-blue-50"
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
