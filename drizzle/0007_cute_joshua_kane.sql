CREATE TABLE IF NOT EXISTS "widgets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"project_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"type" text NOT NULL,
	"options" json DEFAULT '{}'::json NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "widget_testimonials" (
	"widget_id" uuid NOT NULL,
	"testimonial_id" uuid NOT NULL,
	CONSTRAINT "widget_testimonials_widget_id_testimonial_id_pk" PRIMARY KEY("widget_id","testimonial_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "widgets" ADD CONSTRAINT "widgets_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "widget_testimonials" ADD CONSTRAINT "widget_testimonials_widget_id_widgets_id_fk" FOREIGN KEY ("widget_id") REFERENCES "public"."widgets"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "widget_testimonials" ADD CONSTRAINT "widget_testimonials_testimonial_id_testimonials_id_fk" FOREIGN KEY ("testimonial_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;


alter table "widgets" enable row level security;
alter table "widget_testimonials" enable row level security;