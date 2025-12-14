import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - AIWebBuilder Pro</title>
        <meta name="description" content="Privacy Policy for AIWebBuilder Pro - How we collect, use, and protect your data." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-12 max-w-4xl">
          <Link to="/">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
              <p className="text-muted-foreground">
                We collect information you provide directly to us, including your email address, 
                name, and any content you create using our service. We also collect usage data 
                and technical information about your device.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
              <p className="text-muted-foreground">
                We use the information we collect to provide, maintain, and improve our services, 
                to communicate with you, and to protect our users and enforce our terms of service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. Information Sharing</h2>
              <p className="text-muted-foreground">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as necessary to provide our services or as required by law.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">4. Data Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">5. Cookies and Tracking</h2>
              <p className="text-muted-foreground">
                We use cookies and similar tracking technologies to track activity on our service 
                and hold certain information. You can instruct your browser to refuse all cookies 
                or to indicate when a cookie is being sent.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Your Rights</h2>
              <p className="text-muted-foreground">
                You have the right to access, update, or delete your personal information. You may 
                also request a copy of the data we hold about you or ask us to restrict processing.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your personal information for as long as your account is active or as 
                needed to provide you services. We will delete your data upon request, subject 
                to any legal obligations.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">8. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at 
                privacy@aiwebbuilder.pro
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Privacy;
