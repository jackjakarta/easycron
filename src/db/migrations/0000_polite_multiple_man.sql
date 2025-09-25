CREATE SCHEMA "app";
--> statement-breakpoint
CREATE TYPE "app"."http_method" AS ENUM('GET', 'POST');--> statement-breakpoint
CREATE TABLE "app"."account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"id_token" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"name" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"schedule_cron" text NOT NULL,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"http_method" "app"."http_method" DEFAULT 'GET' NOT NULL,
	"url" text NOT NULL,
	"headers" jsonb DEFAULT '[]' NOT NULL,
	"body" text,
	"timeout_ms" integer DEFAULT 10000 NOT NULL,
	"max_retries" integer DEFAULT 2 NOT NULL,
	"backoff_initial_ms" integer DEFAULT 5000 NOT NULL,
	"backoff_factor" real DEFAULT 2 NOT NULL,
	"jitter_ms" integer DEFAULT 500 NOT NULL,
	"hmac_signing_key_id" uuid,
	"last_run_at" timestamp with time zone,
	"next_run_at" timestamp with time zone NOT NULL,
	"consecutive_failures" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."project" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "app"."two_factor" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"secret" text,
	"backup_codes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "two_factor_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "app"."user_entity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"two_factor_enabled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_entity_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "app"."verification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app"."account" ADD CONSTRAINT "account_user_id_user_entity_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user_entity"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."jobs" ADD CONSTRAINT "jobs_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "app"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."project" ADD CONSTRAINT "project_user_id_user_entity_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user_entity"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."session" ADD CONSTRAINT "session_user_id_user_entity_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user_entity"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."two_factor" ADD CONSTRAINT "two_factor_user_id_user_entity_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user_entity"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "jobs_project_id_idx" ON "app"."jobs" USING btree ("next_run_at","project_id");