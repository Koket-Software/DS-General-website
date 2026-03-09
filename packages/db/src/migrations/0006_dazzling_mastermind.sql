CREATE TABLE "achievements" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "image_url" text NOT NULL,
  "position" integer DEFAULT 0 NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE INDEX "idx_achievements_position"
  ON "achievements" USING btree ("position");
--> statement-breakpoint

CREATE INDEX "idx_achievements_is_active"
  ON "achievements" USING btree ("is_active");
