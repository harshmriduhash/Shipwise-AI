
-- Repositories table
CREATE TABLE public.repositories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  github_url TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  default_branch TEXT NOT NULL DEFAULT 'main',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.repositories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own repositories" ON public.repositories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own repositories" ON public.repositories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own repositories" ON public.repositories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own repositories" ON public.repositories FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_repositories_updated_at BEFORE UPDATE ON public.repositories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Pull Requests table
CREATE TABLE public.pull_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  repo_id UUID NOT NULL REFERENCES public.repositories(id) ON DELETE CASCADE,
  github_pr_number INTEGER,
  title TEXT NOT NULL,
  author TEXT,
  branch TEXT,
  risk_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'open',
  files_changed INTEGER DEFAULT 0,
  additions INTEGER DEFAULT 0,
  deletions INTEGER DEFAULT 0,
  ai_summary TEXT,
  ai_verdict TEXT,
  ai_verdict_message TEXT,
  ai_risk_logic INTEGER DEFAULT 0,
  ai_risk_integration INTEGER DEFAULT 0,
  ai_risk_regression INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pull_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view PRs of their repos" ON public.pull_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.repositories WHERE id = repo_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create PRs for their repos" ON public.pull_requests FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.repositories WHERE id = repo_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update PRs of their repos" ON public.pull_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.repositories WHERE id = repo_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete PRs of their repos" ON public.pull_requests FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.repositories WHERE id = repo_id AND user_id = auth.uid())
);

CREATE TRIGGER update_pull_requests_updated_at BEFORE UPDATE ON public.pull_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Test Suggestions table
CREATE TABLE public.test_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pr_id UUID NOT NULL REFERENCES public.pull_requests(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.test_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view test suggestions for their PRs" ON public.test_suggestions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.pull_requests pr JOIN public.repositories r ON pr.repo_id = r.id WHERE pr.id = pr_id AND r.user_id = auth.uid())
);
CREATE POLICY "Users can create test suggestions" ON public.test_suggestions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.pull_requests pr JOIN public.repositories r ON pr.repo_id = r.id WHERE pr.id = pr_id AND r.user_id = auth.uid())
);
CREATE POLICY "Users can update test suggestions" ON public.test_suggestions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.pull_requests pr JOIN public.repositories r ON pr.repo_id = r.id WHERE pr.id = pr_id AND r.user_id = auth.uid())
);
