ALTER TABLE "membership" ALTER COLUMN "accepted" SET DATA TYPE boolean USING "accepted"::boolean;--> statement-breakpoint
ALTER TABLE "membership" ALTER COLUMN "accepted" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "valid_email_format" CHECK ("email" ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$');