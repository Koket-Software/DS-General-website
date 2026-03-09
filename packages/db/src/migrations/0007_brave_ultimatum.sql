CREATE TABLE "newsletters" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"full_name" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"subscribed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"unsubscribed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "newsletters_email_unique" ON "newsletters" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_newsletters_is_active" ON "newsletters" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_newsletters_created_at" ON "newsletters" USING btree ("created_at");