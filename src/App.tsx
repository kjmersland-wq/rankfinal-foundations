import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Footer, Nav } from "@/components/rankfinal/layout";
import Index from "./pages/Index.tsx";
import Browse from "./pages/Browse.tsx";
import SearchPage from "./pages/Search.tsx";
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
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/pricing" element={<PlaceholderPage title="Pricing" />} />
            <Route path="/help" element={<PlaceholderPage title="Help" />} />
            <Route path="/about" element={<PlaceholderPage title="About" />} />
            <Route path="/privacy" element={<PlaceholderPage title="Privacy" />} />
            <Route path="/terms" element={<PlaceholderPage title="Terms" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
