import { pt } from "@lib/i18n/utils";
import permissions from "./app/permissions";

const app = {
	dashboard: {
		title: "Dashboard",
		noOrganization: {
			title: "You have no active organization",
			subTitle: (
				<>
					You must be a part of an organization, either create one or join one.
					<br />
					If you've been invited to an organization you can check your invites by clicking the bell in top right corner
				</>
			),
		},
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
		customer: (count = 1) => `Customer${pt({ other: "s" }, count, "en")}`,
	},
	testimonial: {
		list: {
			title: "Testimonials",
			noFound: "No testimonials found, try to adjust your filter",
		},
		create: {
			title: "Create testimonial",
		},
		detail: {
			rating: "Rating",
		},
	},
	form: {
		list: {
			title: "Forms",
			noFound: "No forms found, try to adjust your filter",
		},
		detail: {
			totalVisits: "Total visits",
			uniqueVisits: "Unique visits",
		},
	},
};

export default app;
