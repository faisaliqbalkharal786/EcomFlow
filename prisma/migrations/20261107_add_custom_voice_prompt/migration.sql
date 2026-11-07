-- Migration: add_custom_voice_prompt
-- Adds customVoicePrompt (nullable TEXT) to the users table for per-tenant AI calling script customization.

ALTER TABLE "users" ADD COLUMN "customVoicePrompt" TEXT;
