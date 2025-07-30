
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import UploadPrescription from "./pages/UploadPrescription";
import PaymentSuccess from "./pages/PaymentSuccess";
import Health from "./pages/Health";
import HealthPost from "./pages/HealthPost";
import BlogPosts from "./pages/BlogPosts";
import BlogPost from "./pages/BlogPost";
import CMSDashboard from "./pages/CMSDashboard";
import NotFound from "./pages/NotFound";
import { PMSApp } from "./com/longchau/pms/main/PMSApp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/upload-prescription" element={<UploadPrescription />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/health" element={<Health />} />
          <Route path="/health/:slug" element={<HealthPost />} />
          <Route path="/blog" element={<BlogPosts />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/cms-dashboard" element={<CMSDashboard />} />
          <Route path="/pms-demo" element={<PMSApp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
