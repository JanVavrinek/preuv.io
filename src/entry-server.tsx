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
					<link rel="icon" href="/favicon.ico" />
					<title>preuv.io</title>
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
