import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { FeatureFlagProvider } from "@/contexts/FeatureFlagContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import CookieConsent from "@/components/CookieConsent";
import PageTransition from "@/components/ui/PageTransition";
import Index from "./pages/Index.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Pricing from "./pages/Pricing.tsx";
import Security from "./pages/Security.tsx";
import Auth from "./pages/Auth.tsx";
import PRDetail from "./pages/PRDetail.tsx";
import Settings from "./pages/Settings.tsx";
import TermsOfService from "./pages/TermsOfService.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import NotFound from "./pages/NotFound.tsx";
import GitHubOAuthReturn from "./pages/GitHubOAuthReturn.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <FeatureFlagProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PageTransition>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/oauth/github/return" element={<GitHubOAuthReturn />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/pr/:id" element={<ProtectedRoute><PRDetail /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/security" element={<Security />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageTransition>
            <CookieConsent />
          </BrowserRouter>
        </TooltipProvider>
      </FeatureFlagProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
