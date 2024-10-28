import { createSignal } from "solid-js";

export default function useAsync<U extends unknown[], V>(asyncFunction: (...args: U) => Promise<V>) {
	const [loading, setLoading] = createSignal(false);

	const handler = async (...args: U): Promise<V> => {
		setLoading(true);
		return asyncFunction(...args).finally(() => setLoading(false));
	};

	return { handler, loading };
}
