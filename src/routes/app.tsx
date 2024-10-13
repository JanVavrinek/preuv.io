import Sidebar from "@molecules/App/Sidebar";
import { clientOnly } from "@solidjs/start";
import { type ParentProps, Suspense } from "solid-js";

const UserProvider = clientOnly(() => import("@contexts/User"));

export default function AppLayout(props: ParentProps) {
	return (
		<UserProvider>
			<main class="flex h-dvh w-dvw flex-row overflow-auto bg-pv-blue-100 dark:bg-gray-900">
				<Sidebar />
				<section class="relative flex h-dvh w-full flex-col">
					<div class="w-full flex-grow p-4 pb-2">
						<div class="h-full w-full ">
							<Suspense>{props.children}</Suspense>
						</div>
					</div>
				</section>
			</main>
		</UserProvider>
	);
}
