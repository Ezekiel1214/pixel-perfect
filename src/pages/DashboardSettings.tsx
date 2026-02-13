import { Helmet } from "react-helmet-async";
import { Settings } from "lucide-react";

const DashboardSettings = () => (
  <>
    <Helmet>
      <title>Settings - AIWebBuilder Pro</title>
    </Helmet>
    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-4">
      <Settings className="w-12 h-12 opacity-50" />
      <h2 className="text-lg font-semibold text-foreground">Settings</h2>
      <p className="text-sm">Account and workspace settings coming soon.</p>
    </div>
  </>
);

export default DashboardSettings;
