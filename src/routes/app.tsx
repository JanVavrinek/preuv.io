import { AppLayoutTitleProvider } from "@contexts/AppLayoutTitle";
import OrganizationsProvider from "@contexts/Organizations";
import Header from "@molecules/App/Header";
import Sidebar from "@molecules/App/Sidebar";
import { clientOnly } from "@solidjs/start";
import { type ParentProps, Suspense } from "solid-js";

const UserProvider = clientOnly(() => import("@contexts/User"));

export default function AppLayout(props: ParentProps) {
	return (
		<AppLayoutTitleProvider>
			<OrganizationsProvider>
				<UserProvider>
					<main class="flex h-dvh w-dvw flex-row overflow-auto bg-pv-blue-100">
						<Sidebar />
						<section class="relative flex h-dvh w-full flex-col">
							<Header />
							<Suspense>{props.children}</Suspense>
						</section>
					</main>
				</UserProvider>
			</OrganizationsProvider>
		</AppLayoutTitleProvider>
	);
}
