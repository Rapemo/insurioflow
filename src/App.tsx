import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from '@/pages/Index';
import Clients from '@/pages/Clients';
import ClientLogin from '@/pages/ClientLogin';
import ClientDashboard from '@/pages/ClientDashboard';
import ClientProfile from '@/pages/ClientProfile';
import CreateClient from '@/pages/CreateClient';
import EditClient from '@/pages/EditClientFull';
import Employees from "./pages/Employees";
import Sales from "./pages/Sales";
import Quotations from "./pages/Quotations";
import QuotationWizard from "./pages/QuotationWizard";
import Policies from "./pages/Policies";
import Renewals from "./pages/Renewals";
import Claims from "./pages/Claims";
import Commissions from "./pages/Commissions";
import Reports from "./pages/Reports";
import Integrations from "./pages/Integrations";
import Configuration from "./pages/Configuration";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/create" element={<CreateClient />} />
          <Route path="/clients/:id/edit" element={<EditClient />} />
          <Route path="/client/login" element={<ClientLogin />} />
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/client/profile" element={<ClientProfile />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/quotations" element={<Quotations />} />
          <Route path="/quotations/new" element={<QuotationWizard />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/renewals" element={<Renewals />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/commissions" element={<Commissions />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/configuration" element={<Configuration />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
