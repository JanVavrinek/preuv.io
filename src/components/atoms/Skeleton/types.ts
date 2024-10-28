import type { SkeletonRootProps } from "@kobalte/core/skeleton";
import type { ValidComponent } from "solid-js";

export interface SkeletonProps<T extends ValidComponent = "div"> extends SkeletonRootProps<T> {
	class?: string;
}
