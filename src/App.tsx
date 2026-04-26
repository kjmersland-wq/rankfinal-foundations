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
import Index from "./pages/Index.tsx";
import Browse from "./pages/Browse.tsx";
import SearchPage from "./pages/Search.tsx";
import Pricing from "./pages/Pricing.tsx";
import Help from "./pages/Help.tsx";
import HelpArticle from "./pages/HelpArticle.tsx";
import About from "./pages/About.tsx";
import { LegalPage } from "./pages/LegalPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import { PlaceholderPage } from "./pages/PlaceholderPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground">
          <Nav />
          <RouteShell>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/help" element={<Help />} />
            <Route path="/help/:slug" element={<HelpArticle />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<LegalPage kind="privacy" />} />
            <Route path="/terms" element={<LegalPage kind="terms" />} />
            <Route path="/cookies" element={<LegalPage kind="cookies" />} />
            <Route path="/disclaimer" element={<LegalPage kind="disclaimer" />} />
            <Route path="*" element={<NotFound />} />
            </Routes>
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
