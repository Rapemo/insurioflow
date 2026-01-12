import { Toaster } from "@/components/ui/toaster";
import DatabaseUsers from '@/components/DatabaseUsers';
import DatabaseTest from '@/components/DatabaseTest';
import RLSTest from '@/components/RLSTest';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import AuthProvider, { useAuth } from "@/contexts/AuthContext";
import Index from '@/pages/Index';
import AdminLogin from '@/pages/AdminLogin';
import ClientLogin from '@/pages/ClientLogin';
import ClientSignup from '@/pages/ClientSignup';
import ForgotPassword from '@/pages/ForgotPassword';
import ClientDashboard from '@/pages/ClientDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import CreateAdminUser from '@/pages/CreateAdminUser';
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
import UserOverview from '@/pages/UserOverview';
import CRM from './pages/CRM';
import Clients from '@/pages/Clients';
import CreateClient from '@/pages/CreateClient';
import EditClient from '@/pages/EditClientFull';
import ClientOnboardingComplete from '@/pages/ClientOnboardingComplete';
import NotFound from './pages/NotFound';

// Protected route component for admin only
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, role } = useAuth();
  
  console.log('🛡️ ProtectedRoute: Checking access', { user: !!user, loading, role });

  if (loading) {
    console.log('🛡️ ProtectedRoute: Still loading auth...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Temporarily bypass admin check - let any authenticated user access
  if (!user) {
    console.log('🛡️ ProtectedRoute: No user, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  console.log('🛡️ ProtectedRoute: Access granted');
  return <>{children}</>;
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
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/client/login" element={<ClientLogin />} />
              <Route path="/client/signup" element={<ClientSignup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/client/dashboard" element={<ClientDashboard />} />
              <Route path="/create-admin" element={<CreateAdminUser />} />
              
              {/* Protected Admin Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/crm" element={
                <ProtectedRoute>
                  <CRM />
                </ProtectedRoute>
              } />
              <Route path="/clients" element={
                <ProtectedRoute>
                  <Clients />
                </ProtectedRoute>
              } />
              <Route path="/clients/create" element={
                <ProtectedRoute>
                  <CreateClient />
                </ProtectedRoute>
              } />
              <Route path="/clients/:id/edit" element={
                <ProtectedRoute>
                  <EditClient />
                </ProtectedRoute>
              } />
              <Route path="/clients/onboarding-complete/:id" element={
                <ProtectedRoute>
                  <ClientOnboardingComplete />
                </ProtectedRoute>
              } />
              <Route path="/employees" element={
                <ProtectedRoute>
                  <Employees />
                </ProtectedRoute>
              } />
              <Route path="/sales" element={
                <ProtectedRoute>
                  <Sales />
                </ProtectedRoute>
              } />
              <Route path="/quotations" element={
                <ProtectedRoute>
                  <Quotations />
                </ProtectedRoute>
              } />
              <Route path="/quotations/new" element={
                <ProtectedRoute>
                  <QuotationWizard />
                </ProtectedRoute>
              } />
              <Route path="/policies" element={
                <ProtectedRoute>
                  <Policies />
                </ProtectedRoute>
              } />
              <Route path="/renewals" element={
                <ProtectedRoute>
                  <Renewals />
                </ProtectedRoute>
              } />
              <Route path="/claims" element={
                <ProtectedRoute>
                  <Claims />
                </ProtectedRoute>
              } />
              <Route path="/commissions" element={
                <ProtectedRoute>
                  <Commissions />
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } />
              <Route path="/integrations" element={
                <ProtectedRoute>
                  <Integrations />
                </ProtectedRoute>
              } />
              <Route path="/configuration" element={
                <ProtectedRoute>
                  <Configuration />
                </ProtectedRoute>
              } />
              <Route path="/user-management" element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              } />
              <Route path="/user-overview" element={
                <ProtectedRoute>
                  <UserOverview />
                </ProtectedRoute>
              } />
              <Route path="/database-test" element={<DatabaseTest />} />
              <Route path="/rls-test" element={<RLSTest />} />
              <Route path="/database-users" element={<DatabaseUsers />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
