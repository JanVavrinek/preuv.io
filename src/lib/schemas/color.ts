import { z } from "zod";

export const hexColorSchema = z
	.string()
	.regex(new RegExp(/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/), "invalid-color");
