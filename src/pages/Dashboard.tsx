import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { ProjectsGrid } from "@/components/dashboard/ProjectsGrid";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import DashboardSettings from "./DashboardSettings";
import DashboardHelp from "./DashboardHelp";

function DashboardPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="h-full min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  const renderDashboardContent = () => {
    if (location.pathname === "/dashboard/settings") {
      return (
        <DashboardPlaceholder
          title="Settings"
          description="Settings are coming soon."
        />
      );
    }

    if (location.pathname === "/dashboard/help") {
      return (
        <DashboardPlaceholder
          title="Help"
          description="Help center is coming soon."
        />
      );
    }

    return <ProjectsGrid />;
  };

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
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </header>
            
            <main className="flex-1 p-6">
              {renderDashboardContent()}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
};

export default Dashboard;
