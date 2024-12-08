import ImageFallback from "@atoms/ImageFallback";
import Skeleton from "@atoms/Skeleton";
import { Image } from "@kobalte/core/image";
import { A } from "@solidjs/router";
import { Show, type VoidProps } from "solid-js";
import type { ProjectCardProps } from "./types";

export default function ProjectCard(props: VoidProps<ProjectCardProps>) {
	return (
		<A
			href={`/app/project/${props.project.id}`}
			class="hover:-translate-y-1 flex flex-col overflow-hidden rounded-2xl border border-pv-blue-200 bg-pv-blue-50 transition-all delay-75 duration-300 ease-over hover:shadow-xl"
		>
			<Image class="flex h-60 w-full items-stretch">
				<Show when={props.project.image} fallback={<ImageFallback text={props.project.name} />}>
					<Image.Img src={props.project.image ?? ""} alt={props.project.name} class="w-full object-cover" />
					<Image.Fallback class="flex w-full">
						<Skeleton />
					</Image.Fallback>
				</Show>
			</Image>
			<div class="border-pv-blue-200 border-t bg-pv-blue-50 p-2">
				<p class="font-semibold text-2xl text-pv-blue-700">{props.project.name}</p>
			</div>
		</A>
	);
}
