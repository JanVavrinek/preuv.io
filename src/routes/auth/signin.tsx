import Button from "@atoms/Button";
import { toast } from "@atoms/Toaster";

export default function SignInView() {
	return (
		<>
			Sign in
			<Button
				onclick={() =>
					toast.show("title", "this is longer description that title")
				}
			>
				test toast
			</Button>
		</>
	);
}
