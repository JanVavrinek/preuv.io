import type { Flatten } from "@solid-primitives/i18n";
import type { dictionaries } from "./translations";

export type RawDictionary = typeof dictionaries.en;
export type Dictionary = Flatten<RawDictionary>;
