import { Helmet } from "react-helmet-async";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { ProjectsGrid } from "@/components/dashboard/ProjectsGrid";

const Dashboard = () => {
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
