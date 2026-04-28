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
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const Index = lazy(() => import("./vite-pages/Index"));
const Browse = lazy(() => import("./vite-pages/Browse"));
const SearchPage = lazy(() => import("./vite-pages/Search"));
const Pricing = lazy(() => import("./vite-pages/Pricing"));
const Help = lazy(() => import("./vite-pages/Help"));
const HelpArticle = lazy(() => import("./vite-pages/HelpArticle"));
const About = lazy(() => import("./vite-pages/About"));
const Contact = lazy(() => import("./vite-pages/Contact"));
const Success = lazy(() => import("./vite-pages/Success"));
const Cancel = lazy(() => import("./vite-pages/Cancel"));
const NotFound = lazy(() => import("./vite-pages/NotFound"));
const SignIn = lazy(() => import("./vite-pages/SignIn"));
const LegalPage = lazy(() => import("./vite-pages/LegalPage").then((m) => ({ default: m.LegalPage })));

const queryClient = new QueryClient();

const routeFallback = (
  <main className="mx-auto w-full max-w-[1280px] space-y-4 px-4 py-10 sm:px-6 lg:px-8">
    <LoadingSkeleton className="h-12 w-56" />
    <LoadingSkeleton className="h-72 w-full rounded-card" />
  </main>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-background text-foreground">
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
                    <Route path="/signin" element={<SignIn />} />
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
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
