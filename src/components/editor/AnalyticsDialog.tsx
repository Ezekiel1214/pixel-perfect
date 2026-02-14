import { useState, useEffect, useCallback } from "react";
import { BarChart3, Eye, Users, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Analytics {
  id: string;
  view_count: number;
  unique_visitors: number;
  last_viewed_at: string | null;
  created_at: string;
  updated_at: string;
}

interface AnalyticsDialogProps {
  projectId: string;
}

export function AnalyticsDialog({ projectId }: AnalyticsDialogProps) {
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("project_analytics")
        .select("*")
        .eq("project_id", projectId)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        // Create analytics record if doesn't exist
        const { data: newData, error: insertError } = await supabase
          .from("project_analytics")
          .insert({ project_id: projectId })
          .select()
          .single();
        
        if (insertError) throw insertError;
        setAnalytics(newData);
      } else {
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load analytics",
      });
    } finally {
      setIsLoading(false);
    }
  }, [projectId, toast]);

  useEffect(() => {
    if (open) {
      fetchAnalytics();
    }
  }, [open, fetchAnalytics]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <BarChart3 className="h-4 w-4 mr-2" />
          Analytics
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Project Analytics</DialogTitle>
          <DialogDescription>
            View performance metrics for your published project
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !analytics ? (
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No analytics data yet</p>
            <p className="text-sm">Publish your project to start tracking</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.view_count}</div>
                <p className="text-xs text-muted-foreground">
                  All-time page views
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.unique_visitors}</div>
                <p className="text-xs text-muted-foreground">
                  Distinct visitors
                </p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Viewed</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-medium">
                  {analytics.last_viewed_at
                    ? format(new Date(analytics.last_viewed_at), "MMM d, yyyy 'at' h:mm a")
                    : "Never"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Most recent visit
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
