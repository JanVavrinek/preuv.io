import type { PaginationRootProps } from "@kobalte/core/pagination";
import type { ValidComponent } from "solid-js";

export interface PaginationProps<T extends ValidComponent = "nav"> extends PaginationRootProps<T> {
	class?: string;
}
