import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import { Toast } from "@kobalte/core/toast";
import I18nProvider from "@lib/i18n";
import { AppThemeProvider } from "@lib/theme";
import { MetaProvider, Title } from "@solidjs/meta";
import { Portal } from "solid-js/web";

export default function App() {
	return (
		<I18nProvider>
			<Router
				root={(props) => (
					<AppThemeProvider>
						<MetaProvider>
							<Suspense>{props.children}</Suspense>
							<Title>preuv.io</Title>
						</MetaProvider>
						<Portal>
							<Toast.Region limit={4}>
								<Toast.List class="fixed top-0 right-0 z-[999] flex w-96 max-w-[100dvw] flex-col gap-2 p-2 outline-none" />
							</Toast.Region>
						</Portal>
					</AppThemeProvider>
				)}
			>
				<FileRoutes />
			</Router>
		</I18nProvider>
	);
}
