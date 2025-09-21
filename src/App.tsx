import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// remove BrowserRouter here because main.tsx already wraps the app with it
// import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
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

// Debug helper: print imported symbols so we can spot undefined/mismatched exports
// (this will appear in the browser console after deploy)
try {
  // eslint-disable-next-line no-console
  console.log("DEBUG imports:", {
    Layout,
    Dashboard,
    FAQList,
    FAQEditor,
    BulkUpload,
    PublishQueue,
    Analytics,
    Versions,
    AdminConsole,
    NotFound,
  });
} catch (e) {
  // eslint-disable-next-line no-console
  console.error("DEBUG imports error", e);
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* main.tsx provides BrowserRouter; do not add another here */}
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
