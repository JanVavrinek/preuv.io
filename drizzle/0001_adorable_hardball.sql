ALTER TABLE "roles" ALTER COLUMN "permissions" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "roles" ADD COLUMN "owner" boolean;