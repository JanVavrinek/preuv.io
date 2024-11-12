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
		empty: {
			title: "Looks like your dashboard is empty",
			subTitle:
				"You can start by creating a new project, then set up forms and finally collect testimonials from your customers",
			createProject: "Create new project",
		},
		latestTestimonial: "Latest testimonial",
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
		list: {
			title: "Projects",
			noFound: "No projects found",
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
			active: "Active",
			share: "Share",
			general: "General form settings",
			name: "Form name",
			namePlaceholder: "Delivery",
			slug: "Slug",
			slugPlaceholder: "form-name",
			content: {
				title: "Content",
				welcome: "Welcome content",
				thankyou: "Thank you content",
			},
		},
		create: {
			title: "Create new form",
		},
	},
	widget: {
		list: {
			title: "Widgets",
			noFound: "No widgets found, try to adjust your filter",
		},
		detail: {
			name: "Widget name",
			namePlaceholder: "Landing page",
			general: "General widget settings",
		},
		create: {
			title: "Create new widget",
		},
	},
};

export default app;
