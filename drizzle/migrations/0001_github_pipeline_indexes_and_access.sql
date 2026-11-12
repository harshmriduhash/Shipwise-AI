CREATE UNIQUE INDEX pull_requests_repo_github_number_uidx_full
  ON public.pull_requests (repo_id, github_pr_number);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.repositories TO authenticated;
GRANT ALL ON public.repositories TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pull_requests TO authenticated;
GRANT ALL ON public.pull_requests TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.test_suggestions TO authenticated;
GRANT ALL ON public.test_suggestions TO service_role;

CREATE POLICY "Users can delete test suggestions for their PRs"
  ON public.test_suggestions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.pull_requests pr
      JOIN public.repositories r ON pr.repo_id = r.id
      WHERE pr.id = pr_id AND r.user_id = auth.uid()
    )
  );

ALTER TABLE public.github_webhook_deliveries
  ADD COLUMN status text NOT NULL DEFAULT 'received',
  ADD COLUMN error_message text;
CREATE INDEX github_webhook_deliveries_received_idx
  ON public.github_webhook_deliveries (received_at DESC);