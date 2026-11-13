ALTER TABLE public.repositories
  ADD COLUMN webhook_status text NOT NULL DEFAULT 'not_configured',
  ADD COLUMN webhook_error text;