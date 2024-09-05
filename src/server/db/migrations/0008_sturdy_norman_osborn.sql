ALTER TABLE "gemini_credentials" ADD COLUMN "api_key" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "gemini_credentials" DROP COLUMN IF EXISTS "access_token";--> statement-breakpoint
ALTER TABLE "gemini_credentials" DROP COLUMN IF EXISTS "refresh_token";--> statement-breakpoint
ALTER TABLE "gemini_credentials" DROP COLUMN IF EXISTS "token_type";--> statement-breakpoint
ALTER TABLE "gemini_credentials" DROP COLUMN IF EXISTS "scope";--> statement-breakpoint
ALTER TABLE "gemini_credentials" DROP COLUMN IF EXISTS "expires_in";