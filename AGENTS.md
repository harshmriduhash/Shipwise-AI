# Architecture Rules

- Keep all provider OAuth, webhook validation, GitHub API access, AI prompts, and privileged database reads inside Supabase Edge Functions; the browser receives only projected product data so GitHub credentials and webhook payloads are not exposed.
