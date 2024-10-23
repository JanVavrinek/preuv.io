import { pt } from "@lib/i18n/utils";
import { formatDate } from "@utils/time";
import type { JSX } from "solid-js";
import type { ZodIssue, ZodTooBigIssue, ZodTooSmallIssue } from "zod";

const tooSmall: Record<ZodTooSmallIssue["type"], (min: number) => string> = {
	array: (min: number) => `Array has to have at least ${min} item${pt({ other: "s" }, min, "en")}`,
	bigint: (min: number) => `Value must have be greater or equal to ${min}`,
	date: (min: number) => `Date must be greater or equal to ${formatDate(new Date(min), "en")}`,
	number: (min: number) => `Value must have be greater or equal to ${min}`,
	set: (min: number) => `Array has to have at least ${min} item${pt({ other: "s" }, min, "en")}`,
	string: (min: number) => `Value must have at least ${min} character${pt({ other: "s" }, min, "en")}`,
};
const tooBig: Record<ZodTooBigIssue["type"], (max: number) => string> = {
	array: (max: number) => `Array has to have maximum of ${max} item${pt({ other: "s" }, max, "en")}`,
	bigint: (max: number) => `Value must have be lower or equal to ${max}`,
	date: (max: number) => `Date must be lower or equal to ${formatDate(new Date(max), "en")}`,
	number: (max: number) => `Value must have be lower or equal to ${max}`,
	set: (max: number) => `Array has to have maximum of ${max} item${pt({ other: "s" }, max, "en")}`,
	string: (min: number) => `Value must have maximum of ${min} character${pt({ other: "s" }, min, "en")}`,
};

const zodIssues: {
	[T in ZodIssue["code"]]: (issue: Extract<ZodIssue, { code: T }>) => JSX.Element;
} = {
	too_big: (i) => tooBig[i.type](Number(i.maximum)),
	too_small: (i) => tooSmall[i.type](Number(i.minimum)),
	invalid_string: (i) => {
		const errs: Record<string, string> = {
			"no-spaces": "No space allowed",
		};
		return errs[i.message] ?? `Invalid ${i.validation}`;
	},
	custom: () => "",
	invalid_arguments: () => "",
	invalid_date: () => "",
	invalid_enum_value: () => "",
	invalid_intersection_types: () => "",
	invalid_literal: () => "",
	invalid_return_type: () => "",
	invalid_type: () => "",
	invalid_union: () => "",
	invalid_union_discriminator: () => "",
	not_finite: () => "",
	not_multiple_of: () => "",
	unrecognized_keys: () => "",
};

const errors = {
	zod: zodIssues,
};
export default errors;
