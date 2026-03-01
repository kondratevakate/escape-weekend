import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { LoginModal } from "@/components/auth/LoginModal";
import Index from "./pages/Index";
import TripPlanner from "./pages/TripPlanner";
import StashPage from "./pages/StashPage";
import CookiePolicy from "./pages/CookiePolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { accessMode } = useUser();

  // All users can access the app — no locked screen

  return (
    <>
      <Toaster />
      <Sonner />
      <LoginModal />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/trip-planner" element={<TripPlanner />} />
          <Route path="/stash" element={<StashPage />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <UserProvider>
        <AuthProvider>
          <TooltipProvider>
            <AppContent />
          </TooltipProvider>
        </AuthProvider>
      </UserProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
