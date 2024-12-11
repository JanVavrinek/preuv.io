import { GridPattern } from "@atoms/GridPattern";
import { AppLayoutTitleProvider } from "@contexts/AppLayoutTitle";
import OrganizationsProvider from "@contexts/Organizations";
import Header from "@molecules/layouts/App/layout/Header";
import Sidebar from "@molecules/layouts/App/layout/Sidebar";
import { clientOnly } from "@solidjs/start";
import { type ParentProps, Suspense, createSignal } from "solid-js";

const UserProvider = clientOnly(() => import("@contexts/User"));

export default function AppLayout(props: ParentProps) {
	const [open, setOpen] = createSignal(false);
	return (
		<AppLayoutTitleProvider>
			<UserProvider>
				<OrganizationsProvider>
					<main class="flex h-dvh w-dvw flex-row">
						<Sidebar onOpen={setOpen} open={open()} />
						<section
							class="relative z-0 flex h-dvh w-full flex-col overflow-auto bg-pv-blue-100 transition-all duration-200 "
							classList={{
								"scale-95 overflow-hidden rounded-2xl lg:scale-100 lg:overflow-auto lg:rounded-none": open(),
							}}
						>
							<GridPattern
								class="-z-[1] fixed inset-0 animate-pulse [animation-duration:_6s] [mask-image:radial-gradient(transparent,white)]"
								strokeDasharray="4"
							/>
							<Header onOpenSideBar={() => setOpen(!open())} />
							<Suspense>{props.children}</Suspense>
						</section>
					</main>
				</OrganizationsProvider>
			</UserProvider>
		</AppLayoutTitleProvider>
	);
}
