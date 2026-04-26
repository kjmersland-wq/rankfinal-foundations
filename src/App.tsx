import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Footer, Nav } from "@/components/rankfinal/layout";
import { CookieConsent } from "@/components/rankfinal/CookieConsent";
import { ScrollToTop } from "@/components/rankfinal/ScrollToTop";
import { AddToHomePrompt } from "@/components/rankfinal/AddToHomePrompt";
import { RouteShell } from "@/components/rankfinal/RouteShell";
import { LoadingSkeleton } from "@/components/rankfinal/ui";
import { PaymentTestModeBanner } from "@/components/payments/PaymentTestModeBanner";

const Index = lazy(() => import("./pages/Index.tsx"));
const Browse = lazy(() => import("./pages/Browse.tsx"));
const SearchPage = lazy(() => import("./pages/Search.tsx"));
const Pricing = lazy(() => import("./pages/Pricing.tsx"));
const Help = lazy(() => import("./pages/Help.tsx"));
const HelpArticle = lazy(() => import("./pages/HelpArticle.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const Success = lazy(() => import("./pages/Success.tsx"));
const Cancel = lazy(() => import("./pages/Cancel.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const LegalPage = lazy(() => import("./pages/LegalPage.tsx").then((module) => ({ default: module.LegalPage })));

const queryClient = new QueryClient();

const routeFallback = (
  <main className="mx-auto w-full max-w-[1280px] space-y-4 px-4 py-10 sm:px-6 lg:px-8">
    <LoadingSkeleton className="h-12 w-56" />
    <LoadingSkeleton className="h-72 w-full rounded-card" />
  </main>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground">
          <PaymentTestModeBanner />
          <Nav />
          <RouteShell>
            <Suspense fallback={routeFallback}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/help" element={<Help />} />
                <Route path="/help/:slug" element={<HelpArticle />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/success" element={<Success />} />
                <Route path="/cancel" element={<Cancel />} />
                <Route path="/privacy" element={<LegalPage kind="privacy" />} />
                <Route path="/terms" element={<LegalPage kind="terms" />} />
                <Route path="/cookies" element={<LegalPage kind="cookies" />} />
                <Route path="/disclaimer" element={<LegalPage kind="disclaimer" />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </RouteShell>
          <Footer />
          <ScrollToTop />
          <CookieConsent />
          <AddToHomePrompt />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
