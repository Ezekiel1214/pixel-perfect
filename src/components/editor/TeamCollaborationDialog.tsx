import { useState, useEffect, useCallback } from "react";
import { Users, UserPlus, Trash2, Loader2, Mail, Copy, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type TeamRole = Database["public"]["Enums"]["team_role"];

interface TeamMember {
  id: string;
  user_id: string;
  role: TeamRole;
  created_at: string;
}

interface PendingInvitation {
  id: string;
  email: string;
  role: TeamRole;
  expires_at: string;
  created_at: string;
}

interface TeamCollaborationDialogProps {
  projectId: string;
  isOwner: boolean;
}

export function TeamCollaborationDialog({ projectId, isOwner }: TeamCollaborationDialogProps) {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<PendingInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamRole>("viewer");
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [membersRes, invitesRes] = await Promise.all([
        supabase
          .from("project_members")
          .select("*")
          .eq("project_id", projectId)
          .order("created_at", { ascending: false }),
        supabase
          .from("project_invitations")
          .select("id, email, role, expires_at, created_at")
          .eq("project_id", projectId)
          .is("accepted_at", null)
          .is("revoked_at", null)
          .order("created_at", { ascending: false }),
      ]);

      if (membersRes.error) throw membersRes.error;
      setMembers(membersRes.data || []);

      if (!invitesRes.error) {
        setInvitations(invitesRes.data || []);
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, fetchData]);

  const handleCreateInvitation = async () => {
    if (!email.trim()) {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please enter an email address",
      });
      return;
    }

    setIsAdding(true);
    try {
      const { data, error } = await supabase.rpc("create_project_invitation", {
        p_project_id: projectId,
        p_email: email.trim(),
        p_role: role,
      });

      if (error) throw error;

      const result = data as unknown as { token: string; expires_at: string };
      const inviteUrl = `${window.location.origin}/accept-invite?token=${result.token}`;

      await navigator.clipboard.writeText(inviteUrl);

      toast({
        title: "Invitation created",
        description: "Invite link copied to clipboard. The recipient can accept after signing in.",
      });
      setEmail("");
      await fetchData();
    } catch (error: unknown) {
      console.error("Error creating invitation:", error);
      const description = error instanceof Error ? error.message : "Failed to create invitation";
      toast({
        variant: "destructive",
        title: "Error",
        description,
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRevokeInvitation = async (inviteId: string) => {
    try {
      const { error } = await supabase.rpc("revoke_project_invitation", {
        p_invite_id: inviteId,
      });
      if (error) throw error;
      toast({ title: "Invitation revoked" });
      fetchData();
    } catch (error) {
      console.error("Error revoking invitation:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to revoke invitation",
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from("project_members")
        .delete()
        .eq("id", memberId);

      if (error) throw error;
      toast({ title: "Member removed" });
      fetchData();
    } catch (error) {
      console.error("Error removing member:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove member",
      });
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: TeamRole) => {
    try {
      const { error } = await supabase
        .from("project_members")
        .update({ role: newRole })
        .eq("id", memberId);

      if (error) throw error;
      toast({ title: "Role updated", description: `Changed to ${newRole}` });
      fetchData();
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update role",
      });
    }
  };

  const getRoleBadgeVariant = (r: TeamRole) => {
    switch (r) {
      case "admin": return "default" as const;
      case "editor": return "secondary" as const;
      default: return "outline" as const;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="h-4 w-4 mr-2" />
          Team
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Team Collaboration</DialogTitle>
          <DialogDescription>
            Invite team members to collaborate on this project
          </DialogDescription>
        </DialogHeader>

        {isOwner && (
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <Select value={role} onValueChange={(v) => setRole(v as TeamRole)}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleCreateInvitation} disabled={isAdding}>
              {isAdding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ScrollArea className="max-h-[400px]">
            {/* Pending Invitations */}
            {invitations.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">Pending Invitations</p>
                <div className="space-y-2">
                  {invitations.map((inv) => (
                    <div
                      key={inv.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{inv.email}</p>
                          <Badge variant={getRoleBadgeVariant(inv.role)} className="text-xs">
                            {inv.role}
                          </Badge>
                        </div>
                      </div>
                      {isOwner && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive shrink-0"
                          onClick={() => handleRevokeInvitation(inv.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {invitations.length > 0 && members.length > 0 && <Separator className="mb-4" />}

            {/* Active Members */}
            {members.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground mb-2">Members</p>
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Team Member</p>
                        <Badge variant={getRoleBadgeVariant(member.role)} className="text-xs">
                          {member.role}
                        </Badge>
                      </div>
                    </div>
                    {isOwner && (
                      <div className="flex items-center gap-2">
                        <Select
                          value={member.role}
                          onValueChange={(v) => handleUpdateRole(member.id, v as TeamRole)}
                        >
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="viewer">Viewer</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : invitations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No team members yet</p>
                <p className="text-sm">Invite others to collaborate</p>
              </div>
            ) : null}
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
