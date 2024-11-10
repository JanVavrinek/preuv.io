import app from "./app";
import auth from "./auth";
import errors from "./errors";
import form from "./form";
import generic from "./generic";

const dict = {
	auth,
	errors,
	app,
	generic,
	form,
} as const;
export default dict;
