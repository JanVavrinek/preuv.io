import permissions from "./app/permissions";

const app = {
	dashboard: {
		title: "Dashboard",
	},
	header: {
		signOut: "Sign out",
	},
	account: {
		title: "Account settings",
		username: "Username",
	},
	organization: {
		create: "Create an organization",
		createSubtitle: "Create new organization and name your owner role",
		notSelected: "No organization selected",
		name: "Organization name",
		organizationPlaceholder: "My Organization",
		change: "Change organization",
		roles: {
			title: "Roles",
			name: "Role name",
			owner: "Owner",
			permissions: {
				title: "Permissions",
				names: permissions,
			},
		},
		edit: {
			title: "Edit organization",
			general: "General organization settings",
		},
	},
};

export default app;
