import auth from "./auth";
import errors from "./errors";

const dict = {
	auth,
	errors,
} as const;
export default dict;
