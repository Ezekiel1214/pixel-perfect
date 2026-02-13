import { useState, useEffect, useCallback } from "react";
import { Users, UserPlus, Trash2, Loader2, Mail } from "lucide-react";
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

interface TeamCollaborationDialogProps {
  projectId: string;
  isOwner: boolean;
}

export function TeamCollaborationDialog({ projectId, isOwner }: TeamCollaborationDialogProps) {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamRole>("viewer");
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("project_members")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (open) {
      fetchMembers();
    }
  }, [open, fetchMembers]);

  const handleAddMember = async () => {
    if (!email.trim()) {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please enter an email address",
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    setIsAdding(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) throw new Error("Not authenticated");

      if (authData.user.email?.toLowerCase() !== normalizedEmail) {
        const { data: invitedUserId, error: lookupError } = await supabase.rpc("get_user_id_by_email", {
          p_email: normalizedEmail,
        });

        if (lookupError) throw lookupError;

        if (invitedUserId) {
          const { error } = await supabase.from("project_members").insert({
            project_id: projectId,
            user_id: invitedUserId,
            role,
            invited_by: authData.user.id,
          });

          if (error && error.code !== "23505") {
            throw error;
          }
        }
      }

      toast({
        title: "Invitation processed",
        description: "If an account exists for that email, access has been granted.",
      });
      setEmail("");
      await fetchMembers();
    } catch (error: unknown) {
      console.error("Error adding member:", error);
      const description = error instanceof Error ? error.message : "Failed to process invitation";
      toast({
        variant: "destructive",
        title: "Error",
        description,
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from("project_members")
        .delete()
        .eq("id", memberId);

      if (error) throw error;

      toast({
        title: "Member removed",
        description: "Team member has been removed",
      });
      fetchMembers();
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

      toast({
        title: "Role updated",
        description: `Member role changed to ${newRole}`,
      });
      fetchMembers();
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update role",
      });
    }
  };

  const getRoleBadgeVariant = (role: TeamRole) => {
    switch (role) {
      case "admin":
        return "default";
      case "editor":
        return "secondary";
      default:
        return "outline";
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
            <Button onClick={handleAddMember} disabled={isAdding}>
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
        ) : members.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No team members yet</p>
            <p className="text-sm">Invite others to collaborate</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
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
                      <p className="text-sm font-medium text-foreground">
                        Team Member
                      </p>
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
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
