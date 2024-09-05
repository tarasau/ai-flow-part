CREATE TABLE IF NOT EXISTS "gemini_credentials" (
	"id" serial PRIMARY KEY NOT NULL,
	"access_token" varchar(255) NOT NULL,
	"refresh_token" varchar(255) NOT NULL,
	"token_type" varchar(255) NOT NULL,
	"scope" varchar(255) NOT NULL,
	"expires_in" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_providers" ADD COLUMN "gemini_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ai_providers" ADD CONSTRAINT "ai_providers_gemini_id_gemini_credentials_id_fk" FOREIGN KEY ("gemini_id") REFERENCES "public"."gemini_credentials"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
