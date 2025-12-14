import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - AIWebBuilder Pro</title>
        <meta name="description" content="Terms of Service for AIWebBuilder Pro - AI-powered website builder." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-12 max-w-4xl">
          <Link to="/">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using AIWebBuilder Pro, you accept and agree to be bound by the terms 
                and provisions of this agreement. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. Description of Service</h2>
              <p className="text-muted-foreground">
                AIWebBuilder Pro is an AI-powered website building platform that allows users to create, 
                edit, and publish websites using artificial intelligence technology.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. User Accounts</h2>
              <p className="text-muted-foreground">
                You are responsible for maintaining the confidentiality of your account credentials 
                and for all activities that occur under your account. You agree to notify us immediately 
                of any unauthorized use of your account.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">4. User Content</h2>
              <p className="text-muted-foreground">
                You retain ownership of all content you create using our service. By using our service, 
                you grant us a license to host and display your content as necessary to provide the service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">5. Prohibited Uses</h2>
              <p className="text-muted-foreground">
                You may not use our service to create content that is illegal, harmful, threatening, 
                abusive, harassing, defamatory, or otherwise objectionable.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                AIWebBuilder Pro shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use of or inability to use the service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. We will notify users of any 
                material changes via email or through the service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">8. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms, please contact us at support@aiwebbuilder.pro
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;
