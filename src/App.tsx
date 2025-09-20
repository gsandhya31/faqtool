import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { Layout } from "@/components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import FAQList from "./pages/FAQList";
import FAQEditor from "./pages/FAQEditor";
import BulkUpload from "./pages/BulkUpload";
import PublishQueue from "./pages/PublishQueue";
import Analytics from "./pages/Analytics";
import Versions from "./pages/Versions";
import AdminConsole from "./pages/AdminConsole";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/faqs" element={<FAQList />} />
              <Route path="/faqs/new" element={<FAQEditor />} />
              <Route path="/faqs/:id/edit" element={<FAQEditor />} />
              <Route path="/bulk-upload" element={<BulkUpload />} />
              <Route path="/publish-queue" element={<PublishQueue />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/versions" element={<Versions />} />
              <Route path="/admin" element={<AdminConsole />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
