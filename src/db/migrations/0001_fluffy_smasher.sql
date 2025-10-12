ALTER TYPE "app"."http_method" ADD VALUE 'PUT';--> statement-breakpoint
ALTER TYPE "app"."http_method" ADD VALUE 'DELETE';--> statement-breakpoint
CREATE TABLE "app"."subscription" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan" text NOT NULL,
	"reference_id" uuid NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"status" text NOT NULL,
	"period_start" timestamp with time zone,
	"period_end" timestamp with time zone,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"seats" integer,
	"trial_start" timestamp with time zone,
	"trial_end" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app"."execution" ADD COLUMN "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."job" ADD COLUMN "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."user_entity" ADD COLUMN "stripe_customer_id" text;--> statement-breakpoint
ALTER TABLE "app"."user_entity" ADD CONSTRAINT "user_entity_stripe_customer_id_unique" UNIQUE("stripe_customer_id");