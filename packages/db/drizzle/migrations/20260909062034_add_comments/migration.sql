CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"content" text NOT NULL,
	"commented_by_id" uuid NOT NULL,
	"issue_id" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "content_not_empty" CHECK (TRIM("content") <> '')
);
--> statement-breakpoint
ALTER TABLE "issues" ALTER COLUMN "description" SET DATA TYPE text USING "description"::text;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_commented_by_id_users_id_fkey" FOREIGN KEY ("commented_by_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_issue_id_issues_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "issues"("id") ON DELETE CASCADE;