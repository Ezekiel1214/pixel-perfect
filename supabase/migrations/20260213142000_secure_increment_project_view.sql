-- Tighten analytics writes by replacing the open UPDATE policy with an RPC increment path.

-- Ensure one analytics row per project so upsert/increment is deterministic.
CREATE UNIQUE INDEX IF NOT EXISTS idx_project_analytics_project_id_unique
ON public.project_analytics(project_id);

-- Remove the open-ended update policy.
DROP POLICY IF EXISTS "Anyone can increment view count" ON public.project_analytics;

-- SECURITY DEFINER RPC to increment view count for public projects only.
CREATE OR REPLACE FUNCTION public.increment_project_view(p_project_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.projects
    WHERE id = p_project_id
      AND is_public = true
  ) THEN
    RETURN;
  END IF;

  INSERT INTO public.project_analytics (project_id, view_count, last_viewed_at)
  VALUES (p_project_id, 1, now())
  ON CONFLICT (project_id)
  DO UPDATE
    SET view_count = public.project_analytics.view_count + 1,
        last_viewed_at = now();
END;
$$;

REVOKE ALL ON FUNCTION public.increment_project_view(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_project_view(UUID) TO anon, authenticated;
