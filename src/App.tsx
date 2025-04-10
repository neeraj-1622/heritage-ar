import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";
import ChatBot from "@/components/ChatBot";
import Index from "./pages/Index";
import SiteDetail from "./pages/SiteDetail";
import ARExperience from "./pages/ARExperience";
import HistoricalSiteView from "./pages/HistoricalSiteView";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Footer from "./components/Footer";
import Profile from './pages/Profile';
import UpdatePassword from './pages/UpdatePassword';
import Tour from './pages/Tour';

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1
    }
  }
});

// Define page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 8
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -8
  }
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.35
};

// AnimationLayout component to handle page transitions
const AnimationLayout = () => {
  const location = useLocation();
  
  // Update favicon
  useEffect(() => {
    const link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    if (link) {
      link.href = "/favicon.svg";
    } else {
      const newLink = document.createElement("link");
      newLink.rel = "icon";
      newLink.href = "/favicon.svg";
      document.head.appendChild(newLink);
    }
  }, []);

  const isARPage = location.pathname === '/ar' || location.pathname === '/historical-site';
  const showChatBot = ['/', '/about', '/privacy', '/terms', '/blog', '/historical-site'].includes(location.pathname);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="min-h-screen flex flex-col scrollbar-none"
      >
        <ScrollToTop />
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Index />} />
          <Route path="/site/:id" element={<SiteDetail />} />
          {/* Removed redundant route /sites/:id */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ar" element={
            <ProtectedRoute>
              <ARExperience />
            </ProtectedRoute>
          } />
          <Route path="/tour" element={
            <ProtectedRoute>
              <Tour />
            </ProtectedRoute>
          } />
          <Route path="/historical-site" element={
            <ProtectedRoute>
              <HistoricalSiteView />
            </ProtectedRoute>
          } />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {!isARPage && <Footer />}
        {showChatBot && <ChatBot />}
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner closeButton richColors position="top-right" toastOptions={{ duration: 3000 }} />
              <AnimationLayout />
            </TooltipProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
