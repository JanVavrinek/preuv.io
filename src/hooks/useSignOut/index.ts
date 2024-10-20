import supabase from "@lib/supabase";
import { useNavigate } from "@solidjs/router";

export default function useSignOut() {
	const navigate = useNavigate();
	return async () => {
		await supabase.auth.signOut();
		navigate("/auth/signin");
	};
}
