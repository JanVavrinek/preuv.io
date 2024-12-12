import { z } from "zod";

export const hexColorSchema = z.string().regex(new RegExp(/^#([0-9a-f]{3}){1,2}$/i), "invalid-color");
