const auth = {
	signIn: {
		title: "Sign In",
		password: "Password",
		email: "E-mail",
		toasts: {
			sigIn: {
				loading: "Signing you in",
				success: "Successfully signed in",
				error: (status: number) => {
					const err: Record<number, string> = {
						400: "Invalid credentials",
						0: "Could not sign in",
					};
					return err[status];
				},
			},
		},
		noAccount: "Do not have account?",
	},
	signUp: {
		title: "Sign Up",
		name: "User name",
		haveAccount: "Already have an account?",
		toasts: {
			signUp: {
				loading: "Signing you up",
				success: "You have been signed up, check your e-mail address",
				error: (status: number) => {
					const err: Record<number, string> = {
						422: "This user already exists",
						0: "Could not sign you up, try again later",
					};
					return err[status];
				},
			},
		},
	},
	demo: (
		<>
			For demo purposes e-mails are automatically verified.
			<br />
			However features relying on e-mails do not work (for example reset password)
		</>
	),
};
export default auth;
