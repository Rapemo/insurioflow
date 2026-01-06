import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import AuthProvider, { useAuth } from "@/contexts/AuthContext";
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
import UserManagement from "./pages/UserManagement";
import UserOverview from "./pages/UserOverview";
import NotFound from "./pages/NotFound";

// Protected route component
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) => {
  const { user, loading, role } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/client/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Admin route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  return <ProtectedRoute children={children} requiredRole="admin" />;
};

// Client route component
const ClientRoute = ({ children }: { children: React.ReactNode }) => {
  return <ProtectedRoute children={children} requiredRole="client" />;
};

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/client/login" element={<ClientLogin />} />
              
              {/* Client Routes */}
              <Route path="/client/dashboard" element={
                <ClientRoute>
                  <ClientDashboard />
                </ClientRoute>
              } />
              <Route path="/client/profile" element={
                <ClientRoute>
                  <ClientProfile />
                </ClientRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/clients" element={
                <AdminRoute>
                  <Clients />
                </AdminRoute>
              } />
              <Route path="/clients/create" element={
                <AdminRoute>
                  <CreateClient />
                </AdminRoute>
              } />
              <Route path="/clients/:id/edit" element={
                <AdminRoute>
                  <EditClient />
                </AdminRoute>
              } />
              <Route path="/employees" element={
                <AdminRoute>
                  <Employees />
                </AdminRoute>
              } />
              <Route path="/sales" element={
                <AdminRoute>
                  <Sales />
                </AdminRoute>
              } />
              <Route path="/quotations" element={
                <AdminRoute>
                  <Quotations />
                </AdminRoute>
              } />
              <Route path="/quotations/new" element={
                <AdminRoute>
                  <QuotationWizard />
                </AdminRoute>
              } />
              <Route path="/policies" element={
                <AdminRoute>
                  <Policies />
                </AdminRoute>
              } />
              <Route path="/renewals" element={
                <AdminRoute>
                  <Renewals />
                </AdminRoute>
              } />
              <Route path="/claims" element={
                <AdminRoute>
                  <Claims />
                </AdminRoute>
              } />
              <Route path="/commissions" element={
                <AdminRoute>
                  <Commissions />
                </AdminRoute>
              } />
              <Route path="/reports" element={
                <AdminRoute>
                  <Reports />
                </AdminRoute>
              } />
              <Route path="/integrations" element={
                <AdminRoute>
                  <Integrations />
                </AdminRoute>
              } />
              <Route path="/configuration" element={
                <AdminRoute>
                  <Configuration />
                </AdminRoute>
              } />
              <Route path="/user-management" element={
                <AdminRoute>
                  <UserManagement />
                </AdminRoute>
              } />
              <Route path="/user-overview" element={
                <AdminRoute>
                  <UserOverview />
                </AdminRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
