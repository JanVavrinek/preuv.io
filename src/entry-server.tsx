// @refresh reload
import { StartServer, createHandler } from "@solidjs/start/server";
import { getCookie, getEvent } from "vinxi/http";
import { CookieKey } from "./consts";

export default createHandler(() => (
	<StartServer
		document={({ assets, children, scripts }) => (
			<html lang="en">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />

					<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
					<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
					<link rel="shortcut icon" href="/favicon.ico" />
					<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
					<link rel="manifest" href="/site.webmanifest" />
					<meta name="msapplication-TileColor" content="#a8b4d1" />
					<meta name="theme-color" content="#a8b4d1" />
					<meta name="og:title" content="preuiv.io" />
					<meta name="og:url" content={import.meta.env.VITE_BASE_URL} />
					<meta name="og:type" content="article" />
					<meta name="og:description" content="preuv.io is self hostable testimonial collection platform" />
					<meta name="author" content="Jan Vavřínek" />
					<meta name="description" content="preuv.io is self hostable testimonial collection platform" />
					{assets}
				</head>
				<body class={getCookie(getEvent(), CookieKey.THEME) === "dark" ? "dark" : ""}>
					<div id="app">{children}</div>
					{scripts}
				</body>
			</html>
		)}
	/>
));
