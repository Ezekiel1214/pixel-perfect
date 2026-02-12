
-- Drop the wide-open analytics UPDATE policy
DROP POLICY IF EXISTS "Anyone can increment view count" ON public.project_analytics;

-- Create a secure RPC function to increment view count atomically
CREATE OR REPLACE FUNCTION public.increment_project_view(p_project_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only increment if a record exists (created by owner)
  UPDATE public.project_analytics
  SET view_count = view_count + 1,
      last_viewed_at = now(),
      updated_at = now()
  WHERE project_id = p_project_id;
END;
$$;

-- Allow owner-scoped UPDATE for analytics (e.g. resetting counts)
CREATE POLICY "Project owners can update analytics"
ON public.project_analytics
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.projects
  WHERE projects.id = project_analytics.project_id
  AND projects.user_id = auth.uid()
));

-- Allow owner-scoped DELETE for analytics cleanup
CREATE POLICY "Project owners can delete analytics"
ON public.project_analytics
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.projects
  WHERE projects.id = project_analytics.project_id
  AND projects.user_id = auth.uid()
));

-- Allow owner-scoped DELETE for version history cleanup
CREATE POLICY "Project owners can delete versions"
ON public.project_versions
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.projects
  WHERE projects.id = project_versions.project_id
  AND projects.user_id = auth.uid()
));
