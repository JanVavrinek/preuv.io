import { RiSystemStarSFill, RiSystemStarSLine } from "solid-icons/ri";
import { Index, Show, type VoidProps } from "solid-js";
import styles from "./styles.module.css";
import type { RatingProps } from "./types";

export default function Rating(props: VoidProps<RatingProps>) {
	return (
		<div class="flex flex-row" inert={props.readonly}>
			<input {...props.inputProps} type="number" hidden />
			<Index each={new Array(5)}>
				{(_, index) => (
					<span class={styles.star} onclick={() => props.onValue?.(index + 1)}>
						<Show when={props.value >= index + 1} fallback={<RiSystemStarSLine font-size={props.fontSize ?? "3rem"} />}>
							<RiSystemStarSFill font-size={props.fontSize ?? "3rem"} />
						</Show>
					</span>
				)}
			</Index>
		</div>
	);
}
