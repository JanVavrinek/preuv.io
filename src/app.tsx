import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import I18nProvider from "@lib/i18n";
import { AppThemeProvider } from "@lib/theme";
import { MetaProvider } from "@solidjs/meta";

export default function App() {
	return (
		<I18nProvider>
			<Router
				root={(props) => (
					<AppThemeProvider>
						<MetaProvider>
							<Suspense>{props.children}</Suspense>
						</MetaProvider>
					</AppThemeProvider>
				)}
			>
				<FileRoutes />
			</Router>
		</I18nProvider>
	);
}
