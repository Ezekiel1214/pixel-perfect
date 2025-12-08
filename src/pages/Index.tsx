import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PipelineSection from "@/components/landing/PipelineSection";
import CollaborationSection from "@/components/landing/CollaborationSection";
import PricingSection from "@/components/landing/PricingSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>AIWebBuilder Pro - One Brain, Seven Hands AI Web Builder</title>
        <meta 
          name="description" 
          content="Build production-ready websites in minutes with AIWebBuilder Pro. Multi-AI orchestration, real-time collaboration, and enterprise-grade security. Start free today." 
        />
        <meta name="keywords" content="AI web builder, website generator, real-time collaboration, multi-AI, web development" />
        <meta property="og:title" content="AIWebBuilder Pro - One Brain, Seven Hands" />
        <meta property="og:description" content="The next-generation AI web builder combining multiple AI models with real-time collaboration." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://aiwebbuilder.pro" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <section id="features">
            <FeaturesSection />
          </section>
          <section id="pipeline">
            <PipelineSection />
          </section>
          <CollaborationSection />
          <section id="pricing">
            <PricingSection />
          </section>
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
