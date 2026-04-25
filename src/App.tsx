import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserProvider } from "@/contexts/UserContext";
import { LoginModal } from "@/components/auth/LoginModal";
import { RouteLoader } from "@/components/RouteLoader";
import Index from "./pages/Index";

// Lazy-load secondary routes — keeps initial bundle focused on the map
const TripPlanner = lazy(() => import("./pages/TripPlanner"));
const StashPage = lazy(() => import("./pages/StashPage"));
const CreatorDashboard = lazy(() => import("./pages/CreatorDashboard"));
const CreatorPublicPage = lazy(() => import("./pages/CreatorPublicPage"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const ClubFeed = lazy(() => import("./pages/ClubFeed"));
const ClubPost = lazy(() => import("./pages/ClubPost"));
const ClubMember = lazy(() => import("./pages/ClubMember"));
const ClubJoin = lazy(() => import("./pages/ClubJoin"));
const ClubNewPost = lazy(() => import("./pages/ClubNewPost"));
const LabsPage = lazy(() => import("./pages/LabsPage"));
const ArticlesIndexPage = lazy(() => import("./pages/ArticlesIndexPage"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <>
      <Toaster />
      <Sonner />
      <LoginModal />
      <BrowserRouter>
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/trip-planner" element={<TripPlanner />} />
            <Route path="/stash" element={<StashPage />} />
            <Route path="/articles" element={<ArticlesIndexPage />} />
            <Route path="/articles/:slug" element={<ArticlePage />} />
            <Route path="/creator" element={<CreatorDashboard />} />
            <Route path="/creator/:id" element={<CreatorPublicPage />} />
            <Route path="/club" element={<ClubFeed />} />
            <Route path="/club/new" element={<ClubNewPost />} />
            <Route path="/club/join" element={<ClubJoin />} />
            <Route path="/club/post/:id" element={<ClubPost />} />
            <Route path="/club/u/:id" element={<ClubMember />} />
            <Route path="/labs" element={<LabsPage />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
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
