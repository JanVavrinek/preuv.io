ALTER TABLE "forms" ADD COLUMN "name" text;
UPDATE "forms" SET "name" = '';
ALTER TABLE "forms" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "forms" ADD CONSTRAINT "forms_slug_unique" UNIQUE("slug");