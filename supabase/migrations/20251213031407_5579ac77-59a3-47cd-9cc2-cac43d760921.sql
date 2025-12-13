-- Create enum for team roles
CREATE TYPE public.team_role AS ENUM ('viewer', 'editor', 'admin');

-- Version history table
CREATE TABLE public.project_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  version_number INTEGER NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  description TEXT
);

-- Enable RLS on project_versions
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;

-- Team members table
CREATE TABLE public.project_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role team_role NOT NULL DEFAULT 'viewer',
  invited_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Enable RLS on project_members
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- Project analytics table
CREATE TABLE public.project_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  view_count INTEGER NOT NULL DEFAULT 0,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  last_viewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on project_analytics
ALTER TABLE public.project_analytics ENABLE ROW LEVEL SECURITY;

-- Add custom CSS/JS fields to projects table
ALTER TABLE public.projects ADD COLUMN custom_css TEXT DEFAULT '';
ALTER TABLE public.projects ADD COLUMN custom_js TEXT DEFAULT '';

-- Create indexes
CREATE INDEX idx_project_versions_project_id ON public.project_versions(project_id);
CREATE INDEX idx_project_versions_created_at ON public.project_versions(created_at DESC);
CREATE INDEX idx_project_members_project_id ON public.project_members(project_id);
CREATE INDEX idx_project_members_user_id ON public.project_members(user_id);
CREATE INDEX idx_project_analytics_project_id ON public.project_analytics(project_id);

-- Security definer function to check project access
CREATE OR REPLACE FUNCTION public.has_project_access(p_project_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.projects WHERE id = p_project_id AND user_id = p_user_id
  ) OR EXISTS (
    SELECT 1 FROM public.project_members WHERE project_id = p_project_id AND user_id = p_user_id
  )
$$;

-- Security definer function to check if user can edit project
CREATE OR REPLACE FUNCTION public.can_edit_project(p_project_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.projects WHERE id = p_project_id AND user_id = p_user_id
  ) OR EXISTS (
    SELECT 1 FROM public.project_members 
    WHERE project_id = p_project_id AND user_id = p_user_id AND role IN ('editor', 'admin')
  )
$$;

-- RLS policies for project_versions
CREATE POLICY "Users can view versions of projects they have access to"
ON public.project_versions FOR SELECT
USING (public.has_project_access(project_id, auth.uid()));

CREATE POLICY "Users can create versions for projects they can edit"
ON public.project_versions FOR INSERT
WITH CHECK (public.can_edit_project(project_id, auth.uid()));

-- RLS policies for project_members
CREATE POLICY "Project owners can manage members"
ON public.project_members FOR ALL
USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()));

CREATE POLICY "Members can view their own membership"
ON public.project_members FOR SELECT
USING (user_id = auth.uid());

-- RLS policies for project_analytics
CREATE POLICY "Project owners and members can view analytics"
ON public.project_analytics FOR SELECT
USING (public.has_project_access(project_id, auth.uid()));

CREATE POLICY "Anyone can increment view count"
ON public.project_analytics FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Project owners can create analytics"
ON public.project_analytics FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid()));

-- Trigger to update analytics updated_at
CREATE TRIGGER update_project_analytics_updated_at
BEFORE UPDATE ON public.project_analytics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();