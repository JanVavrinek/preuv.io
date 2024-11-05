ALTER TABLE "customers" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "testimonials" ADD COLUMN "approved" boolean DEFAULT false NOT NULL;

alter table "testimonials" enable row level security;
alter table "customers" enable row level security;