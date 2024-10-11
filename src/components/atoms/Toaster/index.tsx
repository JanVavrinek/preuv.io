import { Toast as KToast, toaster } from "@kobalte/core/toast";
import { FaSolidXmark } from "solid-icons/fa";
import { type JSX, Match, Show, Switch, type VoidComponent } from "solid-js";
import style from "./style.module.css";
import { ToastType } from "./types";

const Toast: VoidComponent<{
	toastId: number;
	title: JSX.Element;
	description?: JSX.Element;
	type: ToastType;
}> = (props) => (
	<KToast
		toastId={props.toastId}
		class="relative overflow-hidden rounded-2xl border-4 border-pv-blue-900 bg-white shadow-md shadow-pv-blue-900"
		classList={{
			[style.toaster__root]: true,
		}}
	>
		<div class="flex flex-row justify-between gap-2 p-2">
			<div class="flex items-center gap-2">
				<KToast.Title class="text-xl">{props.title}</KToast.Title>
			</div>
			<KToast.CloseButton>
				<FaSolidXmark font-size="30px" />
			</KToast.CloseButton>
		</div>
		<KToast.ProgressTrack class="h-1 w-full bg-pv-blue-900">
			<KToast.ProgressFill class="h-full w-[--kb-toast-progress-fill-width] bg-pv-blue-500" />
		</KToast.ProgressTrack>
		<Show when={props.description}>
			<KToast.Description class="p-2">{props.description}</KToast.Description>
		</Show>
	</KToast>
);

const show = (
	title: JSX.Element,
	description?: JSX.Element,
	type: ToastType = ToastType.DEFAULT,
) =>
	toaster.show((props) => (
		<Toast
			description={description}
			title={title}
			toastId={props.toastId}
			type={type}
		/>
	));

const promise = <T, U extends object = object>(
	p: Promise<U> | (() => Promise<U>),
	options: {
		loading: { title: JSX.Element };
		success: (data?: U) => { title: JSX.Element };
		error: (error?: T) => { title: JSX.Element };
	},
) =>
	toaster.promise(p, (props) => (
		<KToast
			toastId={props.toastId}
			class="relative overflow-hidden rounded-2xl border-4 border-pv-blue-900 bg-white shadow-md shadow-pv-blue-900"
			classList={{
				[style.toaster__root]: true,
			}}
		>
			<div class="flex flex-row justify-between gap-2 p-2">
				<div class="flex items-center gap-2">
					<KToast.Title class="text-xl">
						<Switch fallback={options.loading.title}>
							<Match when={props.state === "rejected"}>
								{options.error(props.error).title}
							</Match>
							<Match when={props.state === "fulfilled"}>
								{options.success(props.data).title}
							</Match>
						</Switch>
					</KToast.Title>
				</div>
				<KToast.CloseButton>
					<FaSolidXmark font-size="30px" />
				</KToast.CloseButton>
			</div>
			<KToast.ProgressTrack class="h-1 w-full bg-pv-blue-900">
				<KToast.ProgressFill class="h-full w-[--kb-toast-progress-fill-width] bg-pv-blue-500" />
			</KToast.ProgressTrack>
		</KToast>
	));

export const toast = {
	show,
	promise,
};
