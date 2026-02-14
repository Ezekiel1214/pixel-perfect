import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Status = "loading" | "success" | "error" | "no-token" | "auth-required";

const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("no-token");
      return;
    }

    if (authLoading) return;

    if (!user) {
      setStatus("auth-required");
      return;
    }

    const accept = async () => {
      setStatus("loading");
      try {
        const { data, error } = await supabase.rpc("accept_project_invitation", {
          p_token: token,
        });
        if (error) throw error;
        setProjectId(data as string);
        setStatus("success");
      } catch (err: unknown) {
        console.error("Accept invite error:", err);
        setErrorMessage(
          err instanceof Error ? err.message : "Failed to accept invitation"
        );
        setStatus("error");
      }
    };

    accept();
  }, [token, user, authLoading]);

  const handleRedirectToAuth = () => {
    const returnUrl = `/accept-invite?token=${token}`;
    navigate(`/auth?redirect=${encodeURIComponent(returnUrl)}`);
  };

  return (
    <>
      <Helmet>
        <title>Accept Invitation - AIWebBuilder Pro</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full text-center space-y-4">
          {status === "loading" && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Accepting invitation…</p>
            </>
          )}

          {status === "auth-required" && (
            <>
              <XCircle className="h-12 w-12 text-muted-foreground mx-auto" />
              <h2 className="text-xl font-semibold text-foreground">Sign in required</h2>
              <p className="text-muted-foreground">
                You need to sign in before accepting this invitation.
              </p>
              <Button onClick={handleRedirectToAuth}>Sign In</Button>
            </>
          )}

          {status === "no-token" && (
            <>
              <XCircle className="h-12 w-12 text-destructive mx-auto" />
              <h2 className="text-xl font-semibold text-foreground">Invalid link</h2>
              <p className="text-muted-foreground">
                This invitation link is missing or malformed.
              </p>
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="h-12 w-12 text-destructive mx-auto" />
              <h2 className="text-xl font-semibold text-foreground">Invitation failed</h2>
              <p className="text-muted-foreground">{errorMessage}</p>
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </Button>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="h-12 w-12 text-primary mx-auto" />
              <h2 className="text-xl font-semibold text-foreground">Invitation accepted!</h2>
              <p className="text-muted-foreground">
                You now have access to the project.
              </p>
              <Button onClick={() => navigate(`/project/${projectId}`)}>
                Open Project
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AcceptInvite;
