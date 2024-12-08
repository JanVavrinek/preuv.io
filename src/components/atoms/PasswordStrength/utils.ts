import type { OptionsType } from "@zxcvbn-ts/core";

export const loadOptions = async (): Promise<OptionsType> => {
	const zxcvbnCommonPackage = await import("@zxcvbn-ts/language-common");
	const zxcvbnEnPackage = await import("@zxcvbn-ts/language-en");

	return {
		dictionary: {
			...zxcvbnCommonPackage.default.dictionary,
			...zxcvbnEnPackage.default.dictionary,
		},
		graphs: zxcvbnCommonPackage.default.adjacencyGraphs,
		translations: zxcvbnEnPackage.default.translations,
	};
};
