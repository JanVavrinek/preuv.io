import { z } from "zod";
import { appThemes } from "./types";

export const appThemeSchema = z.enum(appThemes);
