CREATE TABLE IF NOT EXISTS "forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"welcome" text NOT NULL,
	"thankyou" text NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	"project_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "form_visits" (
	"id" serial PRIMARY KEY NOT NULL,
	"submitted" boolean DEFAULT false NOT NULL,
	"visits" integer DEFAULT 1 NOT NULL,
	"ip" text NOT NULL,
	"form_id" uuid NOT NULL,
	"first_visit_at" timestamp DEFAULT now() NOT NULL,
	"last_visit_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "testimonials" ADD COLUMN "form_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "forms" ADD CONSTRAINT "forms_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "form_visits" ADD CONSTRAINT "form_visits_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

alter table "forms" enable row level security;
alter table "form_visits" enable row level security;