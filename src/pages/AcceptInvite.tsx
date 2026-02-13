import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (loading) return;

    if (!token) {
      toast({ variant: "destructive", title: "Invalid invite", description: "Missing invitation token." });
      navigate("/dashboard", { replace: true });
      return;
    }

    if (!user) {
      navigate(`/auth?next=${encodeURIComponent(`/accept-invite?token=${token}`)}`, { replace: true });
      return;
    }

    const acceptInvite = async () => {
      const { data, error } = await supabase.rpc("accept_project_invitation", { p_token: token });

      if (error || !data) {
        toast({
          variant: "destructive",
          title: "Invite invalid",
          description: "This invitation link is invalid, expired, or already used.",
        });
        navigate("/dashboard", { replace: true });
        return;
      }

      toast({ title: "Invitation accepted", description: "You can now collaborate on this project." });
      navigate(`/project/${data}`, { replace: true });
    };

    void acceptInvite();
  }, [loading, navigate, token, toast, user]);

  return (
    <>
      <Helmet>
        <title>Accept Invitation - AIWebBuilder Pro</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Processing invitation...
        </div>
      </div>
    </>
  );
}
