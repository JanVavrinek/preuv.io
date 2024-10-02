import { type ParentProps, Suspense } from "solid-js";

export default function AuthLayout(props: ParentProps) {
	return <Suspense>{props.children}</Suspense>;
}
