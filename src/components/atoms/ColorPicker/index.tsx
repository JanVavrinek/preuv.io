import Input from "@atoms/Input";
import { DropdownMenu } from "@kobalte/core/dropdown-menu";
import { Slider } from "@kobalte/core/slider";
import { createEffect, createMemo, createSignal } from "solid-js";
import styles from "./styles.module.css";
import type { ColorPickerProps } from "./types";
import { toHex } from "./utils";

export default function ColorPicker(props: ColorPickerProps) {
	const [hue, setHue] = createSignal<[number]>([0]);
	const [saturation, setSaturation] = createSignal(1);
	const [lightness, setLightness] = createSignal(1);
	const [alpha, setAlpha] = createSignal<[number]>([1]);
	const [dragging, setDragging] = createSignal(false);
	let ref: HTMLInputElement | HTMLTextAreaElement | undefined;

	const handleSet = (value: string) => {
		if (!ref) return;
		ref.value = value;
		const inputEvent = new InputEvent("input", {
			bubbles: true,
			cancelable: true,
			inputType: "insertText",
			data: value,
		});

		const changeEvent = new Event("change", {
			bubbles: true,
			cancelable: true,
		});

		ref.dispatchEvent(inputEvent);
		ref.dispatchEvent(changeEvent);
	};

	const handleMouseDown = (
		e: MouseEvent & {
			currentTarget: HTMLDivElement;
		},
	) => {
		if (!dragging()) return;
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		setSaturation(Math.max(Math.min(1, x / rect.width), 0));
		setLightness(Math.max(Math.min(1, y / rect.height), 0));
	};

	const colorComponents = createMemo(() => {
		const v = 1 - lightness();
		const h = hue()[0];
		const s = saturation();

		const c = v * s;
		const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
		const m = v - c;

		let r = 0;
		let g = 0;
		let b = 0;

		if (h >= 0 && h < 60) {
			[r, g, b] = [c, x, 0];
		} else if (h >= 60 && h < 120) {
			[r, g, b] = [x, c, 0];
		} else if (h >= 120 && h < 180) {
			[r, g, b] = [0, c, x];
		} else if (h >= 180 && h < 240) {
			[r, g, b] = [0, x, c];
		} else if (h >= 240 && h < 300) {
			[r, g, b] = [x, 0, c];
		} else {
			[r, g, b] = [c, 0, x];
		}

		const red = Math.round((r + m) * 255);
		const green = Math.round((g + m) * 255);
		const blue = Math.round((b + m) * 255);
		const a = Math.round(alpha()[0]);
		return [red, green, blue, a];
	});

	createEffect(() => {
		const [r, g, b, a] = colorComponents();

		handleSet(`#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`);
	});

	const mouseMove = (e: MouseEvent) => {
		e.stopPropagation();
	};

	createEffect(() => {
		if (dragging()) window.addEventListener("mousemove", mouseMove);
		else window.removeEventListener("mousemove", mouseMove);
	});

	return (
		<div class="flex w-full flex-row gap-2">
			<Input
				inputProps={
					props.inputProps
						? {
								...props.inputProps,
								ref: (r) => {
									ref = r;
									props.inputProps?.ref(r);
								},
							}
						: undefined
				}
				value={props.value}
			/>
			<DropdownMenu gutter={4} modal>
				<DropdownMenu.Trigger class="relative grid aspect-square h-14 place-items-center rounded-xl border border-pv-blue-200 p-2">
					<div style={{ background: props.value }} class="h-full w-full rounded-lg" />
				</DropdownMenu.Trigger>
				<DropdownMenu.Portal>
					<DropdownMenu.Content class={styles.content}>
						<div class="flex w-full flex-col gap-2">
							<div
								class="aspect-video w-full rounded-lg p-2"
								style={{
									background: `linear-gradient(to top, rgb(0, 0, 0), rgba(0, 0, 0, 0)), linear-gradient(to right, rgb(255, 255, 255), rgba(255, 255, 255, 0)), hsl(${hue()}, 100%, 50%)`,
								}}
							>
								<div
									class="relative z-0 h-full w-full rounded-lg"
									onmousemove={handleMouseDown}
									onmousedown={(e) => {
										//@ts-ignore
										e.currentTarget.setPointerCapture(e.pointerId);
										setDragging(true);
									}}
									onmouseup={(e) => {
										//@ts-ignore
										e.currentTarget.releasePointerCapture(e.pointerId);
										setDragging(false);
									}}
									style={{ "touch-action": "none", "forced-color-adjust": "none" }}
								>
									<div
										class="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute z-10 h-4 w-4 rounded-full border-2 border-pv-blue-50"
										style={{ left: `${saturation() * 100}%`, top: `${lightness() * 100}%` }}
									/>
								</div>
							</div>
							<div
								class="h-4 w-full rounded-full px-2"
								style={{
									background:
										"linear-gradient(to right, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 17%, rgb(0, 255, 0) 33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 67%, rgb(255, 0, 255) 83%, rgb(255, 0, 0) 100%)",
								}}
							>
								<Slider class="h-full w-full" minValue={0} maxValue={359} value={hue()} onChange={setHue}>
									<Slider.Track class="relative h-full w-full">
										<Slider.Thumb
											class="h-4 w-4 rounded-full border-2 bg-transparent bg-blend-multiply brightness-150 invert"
											style={{ "border-color": `hsl(${hue()[0]},100%,50%)` }}
										/>
									</Slider.Track>
								</Slider>
							</div>
							<div
								class="relative h-4 w-full rounded-full bg-[length:8px_8px] px-2"
								style={{
									background: "conic-gradient(#eeeeee 0 25%, transparent 0 50%, #eeeeee 0 75%, transparent 0) ",
									"background-size": "8px 8px",
								}}
							>
								<div
									class="absolute inset-0 h-full w-full rounded-full"
									style={{
										background: `linear-gradient(90deg, transparent, rgb(${colorComponents()[0]}, ${colorComponents()[1]}, ${colorComponents()[2]}))`,
									}}
								/>
								<Slider class="h-full w-full" minValue={0} maxValue={255} value={alpha()} onChange={setAlpha}>
									<Slider.Track class="relative h-full w-full rounded-full">
										<Slider.Thumb
											class="h-4 w-4 rounded-full border-2 bg-transparent invert"
											style={{
												"border-color": `rgb(${colorComponents()[0]}, ${colorComponents()[1]}, ${colorComponents()[2]})`,
											}}
										/>
									</Slider.Track>
								</Slider>
							</div>
						</div>
					</DropdownMenu.Content>
				</DropdownMenu.Portal>
			</DropdownMenu>
		</div>
	);
}
