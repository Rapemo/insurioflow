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
import ClientSignup from '@/pages/ClientSignup';
import ForgotPassword from '@/pages/ForgotPassword';
import ConfirmEmail from '@/pages/ConfirmEmail';
import ResetPassword from '@/pages/ResetPassword';
import ClientDashboard from '@/pages/ClientDashboard';
import ClientProfile from '@/pages/ClientProfile';
import CreateClient from '@/pages/CreateClient';
import ClientOnboardingComplete from '@/pages/ClientOnboardingComplete';
import CreateUserSimple from '@/pages/CreateUserSimple';
import UserProfileManagementPage from '@/pages/UserProfileManagementPage';
import EditClient from '@/pages/EditClientFull';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
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
import NotFound from './pages/NotFound';
import CreateAdminUser from '@/components/CreateAdminUser';
import DatabaseUsers from '@/components/DatabaseUsers';
import AuthDebug from '@/components/AuthDebug';
import QuickFixProfile from '@/pages/QuickFixProfile';
import MakeUsersAdmin from '@/pages/MakeUsersAdmin';
import RoleVerification from '@/pages/RoleVerification';

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
    // If user is logged in but wrong role, show access denied instead of redirect
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. 
            {role && ` Current role: ${role}. Required: ${requiredRole}`}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/quick-fix-profile'}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Admin Profile
            </button>
            <button
              onClick={() => window.location.href = '/auth-debug'}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Debug Auth State
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Go Home
            </button>
          </div>
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
              <Route path="/client/signup" element={<ClientSignup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/confirm-email" element={<ConfirmEmail />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/create-admin" element={<CreateAdminUser />} />
              <Route path="/database-users" element={<DatabaseUsers />} />
              <Route path="/auth-debug" element={<AuthDebug />} />
              <Route path="/quick-fix-profile" element={<QuickFixProfile />} />
              <Route path="/make-users-admin" element={<MakeUsersAdmin />} />
              <Route path="/role-verification" element={<RoleVerification />} />
              <Route path="/dashboard" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              
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
              <Route path="/clients/onboarding-complete/:id" element={
                <AdminRoute>
                  <ClientOnboardingComplete />
                </AdminRoute>
              } />
              <Route path="/users/create" element={
                <AdminRoute>
                  <CreateUserSimple />
                </AdminRoute>
              } />
              <Route path="/user-profiles" element={
                <AdminRoute>
                  <UserProfileManagementPage />
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
