CREATE TABLE "app"."customer_subscriptions_stripe" (
	"customer_id" text PRIMARY KEY NOT NULL,
	"subscriptions" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
