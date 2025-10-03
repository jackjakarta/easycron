ALTER TABLE "app"."job" DROP CONSTRAINT "job_hmac_signing_key_id_secret_id_fk";
--> statement-breakpoint
ALTER TABLE "app"."job" DROP COLUMN "hmac_signing_key_id";