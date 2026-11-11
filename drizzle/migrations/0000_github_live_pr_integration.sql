CREATE TABLE public.app_user_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  connector_id text NOT NULL,
  connection_key_ciphertext text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, connector_id)
);
GRANT ALL ON public.app_user_connections TO service_role;
ALTER TABLE public.app_user_connections ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.github_webhook_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id text NOT NULL UNIQUE,
  event_name text NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.github_webhook_deliveries TO service_role;
ALTER TABLE public.github_webhook_deliveries ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.repositories
  ADD COLUMN github_owner text,
  ADD COLUMN github_repo text,
  ADD COLUMN github_repo_id bigint,
  ADD COLUMN is_private boolean NOT NULL DEFAULT false;

ALTER TABLE public.pull_requests
  ADD COLUMN github_html_url text,
  ADD COLUMN github_state text NOT NULL DEFAULT 'open',
  ADD COLUMN head_sha text,
  ADD COLUMN base_branch text,
  ADD COLUMN changed_files jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN ai_review_comments jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN analysis_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN analysis_error text,
  ADD COLUMN last_analyzed_at timestamptz;

CREATE UNIQUE INDEX pull_requests_repo_github_number_uidx
  ON public.pull_requests (repo_id, github_pr_number)
  WHERE github_pr_number IS NOT NULL;
CREATE INDEX repositories_user_github_owner_repo_idx
  ON public.repositories (user_id, github_owner, github_repo);
CREATE INDEX pull_requests_repo_state_updated_idx
  ON public.pull_requests (repo_id, github_state, updated_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.repositories TO authenticated;
GRANT ALL ON public.repositories TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pull_requests TO authenticated;
GRANT ALL ON public.pull_requests TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.test_suggestions TO authenticated;
GRANT ALL ON public.test_suggestions TO service_role;