import { Helmet } from "react-helmet-async";
import { HelpCircle } from "lucide-react";

const DashboardHelp = () => (
  <>
    <Helmet>
      <title>Help - AIWebBuilder Pro</title>
    </Helmet>
    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-4">
      <HelpCircle className="w-12 h-12 opacity-50" />
      <h2 className="text-lg font-semibold text-foreground">Help & Support</h2>
      <p className="text-sm">Documentation and support resources coming soon.</p>
    </div>
  </>
);

export default DashboardHelp;
