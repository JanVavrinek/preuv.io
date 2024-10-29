import { AppLayoutTitleProvider } from "@contexts/AppLayoutTitle";
import OrganizationsProvider from "@contexts/Organizations";
import Header from "@molecules/App/Header";
import Sidebar from "@molecules/App/Sidebar";
import { clientOnly } from "@solidjs/start";
import { type ParentProps, Suspense, createSignal } from "solid-js";

const UserProvider = clientOnly(() => import("@contexts/User"));

export default function AppLayout(props: ParentProps) {
	const [open, setOpen] = createSignal(false);
	return (
		<AppLayoutTitleProvider>
			<OrganizationsProvider>
				<UserProvider>
					<main class="flex h-dvh w-dvw flex-row ">
						<Sidebar onOpen={setOpen} open={open()} />
						<section
							class="relative z-0 flex h-dvh w-full flex-col overflow-auto bg-pv-blue-100 transition-all duration-200 "
							classList={{
								"scale-95 overflow-hidden rounded-2xl lg:scale-100 lg:overflow-auto lg:rounded-none": open(),
							}}
						>
							<Header onOpenSideBar={() => setOpen(!open())} />
							<Suspense>{props.children}</Suspense>
						</section>
					</main>
				</UserProvider>
			</OrganizationsProvider>
		</AppLayoutTitleProvider>
	);
}
