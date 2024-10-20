import app from "./app";
import auth from "./auth";
import errors from "./errors";
import generic from "./generic";

const dict = {
	auth,
	errors,
	app,
	generic,
} as const;
export default dict;
