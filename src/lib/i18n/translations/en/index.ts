import app from "./app";
import auth from "./auth";
import errors from "./errors";
import form from "./form";
import generic from "./generic";
import landing from "./landing";

const dict = {
	auth,
	errors,
	app,
	generic,
	form,
	landing,
} as const;
export default dict;
