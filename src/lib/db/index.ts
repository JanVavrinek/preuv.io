import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { customer, customerRelations } from "./schemas/customer";
import { form, formRelations } from "./schemas/form";
import { formVisit, formVisitRelations } from "./schemas/formVisit";
import { invite } from "./schemas/invite";
import { member } from "./schemas/member";
import { organization } from "./schemas/organization";
import { project, projectRelations } from "./schemas/project";
import { role } from "./schemas/role";
import { testimonial, testimonialRelations } from "./schemas/testimonial";
import { user } from "./schemas/user";
import { widget, widgetRelations } from "./schemas/widget";
import { widgetTestimonial, widgetTestimonialRelations } from "./schemas/widgetTestimonials";

const client = postgres(import.meta.env.VITE_DB_URL, { prepare: false });

export const db = drizzle(client, {
	schema: {
		role,
		organization,
		member,
		user,
		invite,
		project,
		projectRelations,
		testimonial,
		testimonialRelations,
		customerRelations,
		form,
		formRelations,
		formVisit,
		formVisitRelations,
		customer,
		widget,
		widgetRelations,
		widgetTestimonial,
		widgetTestimonialRelations,
	},
});
