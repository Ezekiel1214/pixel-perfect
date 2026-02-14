
-- PHASE 3: Signed-token invitation system

-- Create project_invitations table
CREATE TABLE public.project_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  email text NOT NULL,
  role public.team_role NOT NULL DEFAULT 'viewer',
  invited_by uuid NOT NULL REFERENCES auth.users(id),
  token_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_project_invitations_project_id ON public.project_invitations(project_id);
CREATE INDEX idx_project_invitations_email ON public.project_invitations(lower(email));
CREATE UNIQUE INDEX idx_project_invitations_token_hash ON public.project_invitations(token_hash);
CREATE UNIQUE INDEX idx_project_invitations_active
  ON public.project_invitations(project_id, lower(email))
  WHERE accepted_at IS NULL AND revoked_at IS NULL;

-- Enable RLS
ALTER TABLE public.project_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Members can view invitations"
  ON public.project_invitations FOR SELECT
  USING (public.has_project_access(project_id, auth.uid()));

CREATE POLICY "Editors can create invitations"
  ON public.project_invitations FOR INSERT
  WITH CHECK (
    public.can_edit_project(project_id, auth.uid())
    AND invited_by = auth.uid()
  );

CREATE POLICY "Editors can revoke invitations"
  ON public.project_invitations FOR DELETE
  USING (public.can_edit_project(project_id, auth.uid()));

-- RPC: create_project_invitation
CREATE OR REPLACE FUNCTION public.create_project_invitation(
  p_project_id uuid,
  p_email text,
  p_role public.team_role DEFAULT 'viewer',
  p_ttl_minutes int DEFAULT 10080
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token text;
  v_token_hash text;
  v_expires_at timestamptz;
  v_invite_id uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF NOT public.can_edit_project(p_project_id, auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized to invite members to this project';
  END IF;

  v_token := encode(gen_random_bytes(32), 'hex');
  v_token_hash := encode(sha256(v_token::bytea), 'hex');
  v_expires_at := now() + (p_ttl_minutes || ' minutes')::interval;

  INSERT INTO public.project_invitations (
    project_id, email, role, invited_by, token_hash, expires_at
  ) VALUES (
    p_project_id, lower(trim(p_email)), p_role, auth.uid(), v_token_hash, v_expires_at
  )
  RETURNING id INTO v_invite_id;

  RETURN jsonb_build_object(
    'invite_id', v_invite_id,
    'token', v_token,
    'expires_at', v_expires_at
  );
END;
$$;

-- RPC: accept_project_invitation
CREATE OR REPLACE FUNCTION public.accept_project_invitation(p_token text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token_hash text;
  v_invite record;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  v_token_hash := encode(sha256(p_token::bytea), 'hex');

  SELECT * INTO v_invite
  FROM public.project_invitations
  WHERE token_hash = v_token_hash
    AND accepted_at IS NULL
    AND revoked_at IS NULL
    AND expires_at > now();

  IF v_invite IS NULL THEN
    RAISE EXCEPTION 'Invitation is invalid, expired, or already used';
  END IF;

  INSERT INTO public.project_members (project_id, user_id, role, invited_by)
  VALUES (v_invite.project_id, auth.uid(), v_invite.role, v_invite.invited_by)
  ON CONFLICT DO NOTHING;

  UPDATE public.project_invitations
  SET accepted_at = now()
  WHERE id = v_invite.id;

  RETURN v_invite.project_id;
END;
$$;

-- RPC: revoke_project_invitation
CREATE OR REPLACE FUNCTION public.revoke_project_invitation(p_invite_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_project_id uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  SELECT project_id INTO v_project_id
  FROM public.project_invitations
  WHERE id = p_invite_id AND accepted_at IS NULL AND revoked_at IS NULL;

  IF v_project_id IS NULL THEN
    RAISE EXCEPTION 'Invitation not found or already processed';
  END IF;

  IF NOT public.can_edit_project(v_project_id, auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized to revoke this invitation';
  END IF;

  UPDATE public.project_invitations
  SET revoked_at = now()
  WHERE id = p_invite_id;
END;
$$;

-- Grant execute on new RPCs to authenticated
GRANT EXECUTE ON FUNCTION public.create_project_invitation(uuid, text, public.team_role, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_project_invitation(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.revoke_project_invitation(uuid) TO authenticated;
