import { useState, useEffect, useCallback } from "react";
import { Users, UserPlus, Trash2, Loader2, Mail } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
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
  const [pendingInvites, setPendingInvites] = useState<PendingInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamRole>("viewer");
  const [isAdding, setIsAdding] = useState(false);
  const [revokingInviteId, setRevokingInviteId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMembers = useCallback(async () => {
    const { data, error } = await supabase
      .from("project_members")
      .select("id, user_id, role, created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    setMembers((data as TeamMember[]) || []);
  }, [projectId]);

  const fetchPendingInvites = useCallback(async () => {
    const { data, error } = await supabase
      .from("project_invitations")
      .select("id, email, role, expires_at, created_at")
      .eq("project_id", projectId)
      .is("accepted_at", null)
      .is("revoked_at", null)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    setPendingInvites((data as PendingInvitation[]) || []);
  }, [projectId]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchMembers(), fetchPendingInvites()]);
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load collaboration data",
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchMembers, fetchPendingInvites, toast]);

  useEffect(() => {
    if (open) {
      void fetchData();
    }
  }, [open, fetchData]);

  const handleAddMember = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please enter an email address",
      });
      return;
    }

    setIsAdding(true);
    try {
      const { error } = await supabase.rpc("create_project_invitation", {
        p_project_id: projectId,
        p_email: normalizedEmail,
        p_role: role,
      });

      if (error) throw error;

      toast({
        title: "Invitation created",
        description:
          "If an account exists for that email, they can accept it after signing in.",
      });

      setEmail("");
      await fetchPendingInvites();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create invitation",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const { error } = await supabase.from("project_members").delete().eq("id", memberId);

      if (error) throw error;

      toast({
        title: "Member removed",
        description: "Team member has been removed",
      });
      await fetchMembers();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove member",
      });
    }
  };

  const handleRevokeInvite = async (inviteId: string) => {
    setRevokingInviteId(inviteId);
    try {
      const { error } = await supabase.from("project_invitations").delete().eq("id", inviteId);
      if (error) throw error;

      toast({
        title: "Invitation revoked",
        description: "The pending invitation was revoked",
      });
      await fetchPendingInvites();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to revoke invitation",
      });
    } finally {
      setRevokingInviteId(null);
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: TeamRole) => {
    try {
      const { error } = await supabase
        .from("project_members")
        .update({ role: newRole })
        .eq("id", memberId);

      if (error) throw error;

      toast({
        title: "Role updated",
        description: `Member role changed to ${newRole}`,
      });
      await fetchMembers();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update role",
      });
    }
  };

  const getRoleBadgeVariant = (memberRole: TeamRole) => {
    switch (memberRole) {
      case "admin":
        return "default" as const;
      case "editor":
        return "secondary" as const;
      default:
        return "outline" as const;
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
          <DialogDescription>Invite team members to collaborate on this project</DialogDescription>
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
            <Button onClick={handleAddMember} disabled={isAdding}>
              {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div>
              <h4 className="text-sm font-medium mb-2">Team members</h4>
              {members.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No team members yet</p>
                </div>
              ) : (
                <ScrollArea className="h-[180px]">
                  <div className="space-y-2 pr-2">
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
                              onClick={() => void handleRemoveMember(member.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>

            <Separator className="my-4" />

            <div>
              <h4 className="text-sm font-medium mb-2">Pending invitations</h4>
              {pendingInvites.length === 0 ? (
                <p className="text-sm text-muted-foreground">No pending invitations.</p>
              ) : (
                <ScrollArea className="h-[140px]">
                  <div className="space-y-2 pr-2">
                    {pendingInvites.map((invite) => (
                      <div
                        key={invite.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{invite.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {invite.role} • expires {formatDistanceToNow(new Date(invite.expires_at), { addSuffix: true })}
                          </p>
                        </div>
                        {isOwner && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            disabled={revokingInviteId === invite.id}
                            onClick={() => void handleRevokeInvite(invite.id)}
                          >
                            {revokingInviteId === invite.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
