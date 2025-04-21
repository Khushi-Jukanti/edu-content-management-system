import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminLayout } from "@/components/admin/AdminLayout";

// Regular routes
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Admin routes
import Login from "./pages/admin/Login";
import ForgotPassword from "./pages/admin/ForgotPassword";
import Dashboard from "./pages/admin/Dashboard";
import Courses from "./pages/admin/Courses";
import Classes from "./pages/admin/Classes";
import Subjects from "./pages/admin/Subjects";
import Chapters from "./pages/admin/Chapters";
import Topics from "./pages/admin/Topics";
import Videos from "./pages/admin/Videos";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Regular routes */}
            <Route path="/" element={<Index />} />
            
            {/* Admin routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="courses" element={<Courses />} />
              <Route path="classes" element={<Classes />} />
              <Route path="subjects" element={<Subjects />} />
              <Route path="chapters" element={<Chapters />} />
              <Route path="topics" element={<Topics />} />
              <Route path="videos" element={<Videos />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
