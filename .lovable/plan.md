

## Fix Team Member Invitation Flow

The current `TeamCollaborationDialog` has a known bug: when inviting a team member by email, it inserts the **current user's ID** instead of resolving the invited user's ID from the email. This plan addresses that.

### Changes

**1. Create a `profiles` table (DB migration)**

- Add `public.profiles` with columns: `id` (UUID, PK, references `auth.users`), `email` (TEXT), `created_at`, `updated_at`
- Enable RLS: users can read all profiles (needed for email lookup) but only update their own
- Create a trigger on `auth.users` (via a `public` schema function) to auto-populate a profile row on signup

**2. Create a server-side email lookup function (DB function)**

- `public.get_user_id_by_email(p_email TEXT) RETURNS UUID` -- SECURITY DEFINER function
- Looks up `profiles` table by email, returns `user_id` or NULL
- This avoids exposing the full profiles table while allowing invite-by-email

**3. Update `TeamCollaborationDialog.tsx`**

- Replace the placeholder `user_id: user.user.id` with a call to the `get_user_id_by_email` RPC
- Handle the case where no user is found (show a toast: "No account found with that email")
- Display the member's email from profiles instead of "Team Member" placeholder
- Fetch member details (email) alongside membership data using a join or separate query

**4. Update member list to show real emails**

- Modify `fetchMembers` to also retrieve the profile email for each member (via a DB view or RPC)
- Display actual email addresses in the member list instead of "Team Member"

### Technical Details

Migration SQL (simplified):

```sql
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read profiles"
  ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Email lookup RPC
CREATE OR REPLACE FUNCTION public.get_user_id_by_email(p_email TEXT)
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.profiles WHERE email = p_email LIMIT 1;
$$;
```

Component changes in `TeamCollaborationDialog.tsx`:
- `handleAddMember`: call `supabase.rpc('get_user_id_by_email', { p_email: email })`, validate result, then insert into `project_members` with the resolved user ID
- `fetchMembers`: query `project_members` and then batch-fetch emails from `profiles` for display
- Show email in member list rows instead of "Team Member"

### Edge Cases

- **User not found**: Show clear error toast -- "No account found for that email. They must sign up first."
- **Self-invite prevention**: Check if resolved user ID matches current user and block
- **Duplicate invite prevention**: The existing unique constraint on `(project_id, user_id)` in `project_members` handles this; surface a friendly error message
- **Backfill existing users**: The migration should also insert profiles for any existing `auth.users` rows
