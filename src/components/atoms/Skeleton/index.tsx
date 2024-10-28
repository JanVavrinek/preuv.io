import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { Skeleton as KSkeleton } from "@kobalte/core/skeleton";
import { type ValidComponent, splitProps } from "solid-js";
import { skeletonStyles } from "./styles";
import styles from "./styles.module.css";
import type { SkeletonProps } from "./types";

export default function Skeleton<T extends ValidComponent = "button">(props: PolymorphicProps<T, SkeletonProps<T>>) {
	const [local, others] = splitProps(props as SkeletonProps, ["class"]);

	return (
		<KSkeleton
			{...others}
			class={skeletonStyles().root({
				class: [styles.skeleton, local.class],
			})}
		/>
	);
}
