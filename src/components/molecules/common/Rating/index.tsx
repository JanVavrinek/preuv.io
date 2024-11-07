import { RiSystemStarSFill } from "solid-icons/ri";
import { Index, type VoidProps } from "solid-js";
import styles from "./styles.module.css";
import type { RatingProps } from "./types";

export default function Rating(props: VoidProps<RatingProps>) {
	return (
		<div class="flex flex-row" inert={props.readonly}>
			<Index each={new Array(5)}>
				{() => (
					<span class={styles.star}>
						<RiSystemStarSFill font-size="3rem" />
					</span>
				)}
			</Index>
			<input {...props.inputProps} hidden value={props.value} />
		</div>
	);
}
