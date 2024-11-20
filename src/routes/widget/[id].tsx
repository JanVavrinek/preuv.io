import { getWidget } from "@lib/server/routes/widget";
import options from "@lib/widgets";
import { type RouteDefinition, createAsync, useParams } from "@solidjs/router";
import { Dynamic, Show } from "solid-js/web";
import { z } from "zod";

export const route = {
	matchFilters: {
		id: (id) => z.string().uuid().safeParse(id).success,
	},
	preload: ({ params }) => getWidget(params.id),
} satisfies RouteDefinition;

export default function WidgetView() {
	const params = useParams<{ id: string }>();
	const widget = createAsync(() => getWidget(params.id), { deferStream: true });

	return (
		<Show when={widget()} keyed>
			{(w) => (
				<Dynamic component={options[w.type].component} testimonials={w.testimonials} options={w.options as never} />
			)}
		</Show>
	);
}
