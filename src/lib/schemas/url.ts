import toSlug from "@utils/slug";
import { z } from "zod";

export const urlSlugSchema = z
	.string()
	.min(6)
	.max(128)
	.transform((str) => toSlug(str))
	.refine((slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug), "slug");
