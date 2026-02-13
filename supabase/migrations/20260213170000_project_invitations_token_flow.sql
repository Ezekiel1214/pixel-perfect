-- Step 1: Revoke unsafe lookup for authenticated users (keep PUBLIC revoked).
REVOKE EXECUTE ON FUNCTION public.get_user_id_by_email(TEXT) FROM authenticated;

-- Step 2: Signed-token invitation table.
CREATE TABLE IF NOT EXISTS public.project_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'viewer',
  invited_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  token_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  accepted_at timestamptz NULL,
  revoked_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_invites_project_id ON public.project_invitations(project_id);
CREATE INDEX IF NOT EXISTS idx_project_invites_email_lower ON public.project_invitations(lower(email));
CREATE UNIQUE INDEX IF NOT EXISTS ux_project_invites_token_hash ON public.project_invitations(token_hash);
CREATE UNIQUE INDEX IF NOT EXISTS ux_project_invites_project_email_pending
  ON public.project_invitations(project_id, lower(email))
  WHERE accepted_at IS NULL AND revoked_at IS NULL;

ALTER TABLE public.project_invitations ENABLE ROW LEVEL SECURITY;

-- Step 3: RLS policies.
DROP POLICY IF EXISTS "project_members_can_view_invites" ON public.project_invitations;
CREATE POLICY "project_members_can_view_invites"
ON public.project_invitations
FOR SELECT
USING (public.has_project_access(project_id, auth.uid()));

DROP POLICY IF EXISTS "project_editors_can_create_invites" ON public.project_invitations;
CREATE POLICY "project_editors_can_create_invites"
ON public.project_invitations
FOR INSERT
WITH CHECK (
  public.can_edit_project(project_id, auth.uid())
  AND invited_by = auth.uid()
);

DROP POLICY IF EXISTS "project_editors_can_delete_invites" ON public.project_invitations;
CREATE POLICY "project_editors_can_delete_invites"
ON public.project_invitations
FOR DELETE
USING (public.can_edit_project(project_id, auth.uid()));

-- Step 4A: Create invitation (returns raw token once).
CREATE OR REPLACE FUNCTION public.create_project_invitation(
  p_project_id uuid,
  p_email text,
  p_role text DEFAULT 'viewer',
  p_ttl_minutes int DEFAULT 10080
)
RETURNS TABLE(invite_id uuid, token text, expires_at timestamptz)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_token text;
  v_token_hash text;
  v_expires timestamptz;
  v_role public.team_role;
BEGIN
  IF NOT public.can_edit_project(p_project_id, auth.uid()) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  v_role := p_role::public.team_role;
  v_token := encode(gen_random_bytes(32), 'hex');
  v_token_hash := encode(digest(v_token, 'sha256'), 'hex');
  v_expires := now() + make_interval(mins => p_ttl_minutes);

  INSERT INTO public.project_invitations (
    project_id, email, role, invited_by, token_hash, expires_at
  )
  VALUES (p_project_id, lower(trim(p_email)), v_role::text, auth.uid(), v_token_hash, v_expires)
  RETURNING id INTO invite_id;

  token := v_token;
  expires_at := v_expires;
  RETURN NEXT;
END;
$$;

REVOKE ALL ON FUNCTION public.create_project_invitation(uuid, text, text, int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_project_invitation(uuid, text, text, int) TO authenticated;

-- Step 4B: Accept invitation.
CREATE OR REPLACE FUNCTION public.accept_project_invitation(
  p_token text
)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_token_hash text;
  v_invite record;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  v_token_hash := encode(digest(p_token, 'sha256'), 'hex');

  SELECT * INTO v_invite
  FROM public.project_invitations
  WHERE token_hash = v_token_hash
    AND accepted_at IS NULL
    AND revoked_at IS NULL
    AND expires_at > now()
  FOR UPDATE;

  IF v_invite.id IS NULL THEN
    RAISE EXCEPTION 'invalid or expired invite';
  END IF;

  INSERT INTO public.project_members(project_id, user_id, role, invited_by)
  VALUES (v_invite.project_id, auth.uid(), v_invite.role::public.team_role, v_invite.invited_by)
  ON CONFLICT DO NOTHING;

  UPDATE public.project_invitations
  SET accepted_at = now()
  WHERE id = v_invite.id;

  RETURN v_invite.project_id;
END;
$$;

REVOKE ALL ON FUNCTION public.accept_project_invitation(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.accept_project_invitation(text) TO authenticated;
