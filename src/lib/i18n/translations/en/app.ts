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
			new: "Create new role",
		},
		edit: {
			title: "Edit organization",
			general: "General organization settings",
		},
		members: {
			title: "Members",
			leave: "Leave",
		},
	},
	invite: {
		title: "Invites",
		text: "You have been invited to",
		join: "Join",
		decline: "Decline",
		create: "Invite members",
		add: "Add invite",
		noInvites: "There are no invites",
	},
	fallback: {
		text: "Could not find what you are looking for",
		back: "Go back to Dashboard",
	},
	project: {
		edit: {
			title: "General project settings",
			name: "Project name",
			placeholder: "My project",
		},
		create: {
			title: "Create new project",
		},
	},
	customer: {
		list: {
			title: "Customers",
			noFound: "No customers found, try to adjust your filter",
		},
		detail: {
			name: "Customer name",
			testimonialCount: "No. of testimonials",
			title: {
				label: "Title",
				placeholder: "Assistant (to) the Regional Manager",
			},
			company: {
				label: "Company",
				placeholder: "Dunder Mifflin",
			},
		},
		create: {
			title: "Create new customer",
			noProject: "Select a project",
		},
	},
	testimonial: {
		list: {
			title: "Testimonials",
			noFound: "No testimonials found, try to adjust your filter",
		},
		create: {
			title: "Create testimonial",
		},
	},
};

export default app;
