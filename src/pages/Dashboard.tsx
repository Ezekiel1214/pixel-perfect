import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { ProjectsGrid } from "@/components/dashboard/ProjectsGrid";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - AIWebBuilder Pro</title>
        <meta name="description" content="Manage your AI-powered web projects" />
      </Helmet>

      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          
          <div className="flex-1 flex flex-col">
            <header className="h-14 border-b border-border flex items-center px-4 gap-4">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold">My Projects</h1>
            </header>
            
            <main className="flex-1 p-6">
              <ProjectsGrid />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
};

export default Dashboard;
