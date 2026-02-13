-- Expand project RLS for collaboration access while keeping deletes owner-only.

-- Replace owner-only SELECT policy with team-aware access policy.
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
CREATE POLICY "Users can view projects they have access to"
ON public.projects
FOR SELECT
USING (public.has_project_access(id, auth.uid()));

-- Replace owner-only UPDATE policy with team-aware edit policy.
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
CREATE POLICY "Users can update projects they can edit"
ON public.projects
FOR UPDATE
USING (public.can_edit_project(id, auth.uid()))
WITH CHECK (public.can_edit_project(id, auth.uid()));
