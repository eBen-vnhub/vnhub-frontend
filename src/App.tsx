import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { VendorsProvider } from './contexts/VendorsContext';
import LoginPage from './features/auth/pages/LoginPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage';
import SetPasswordPage from './features/auth/pages/SetPasswordPage';
import WorkspaceSelectionPage from './features/portal/pages/WorkspaceSelectionPage';
import PortalLayout from './layouts/PortalLayout';
import SubscriptionsPage from './features/portal/pages/SubscriptionsPage';
import CompanyProfilePage from './features/portal/pages/CompanyProfilePage';
import VendorAdminPage from './features/portal/pages/VendorAdminPage';
import ChangePasswordPage from './features/auth/pages/ChangePasswordPage';
import UserProfilePage from './features/portal/pages/UserProfilePage';
import ProtectedRoute from './components/guards/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/set-password" element={<SetPasswordPage />} />
        
        <Route path="/select-workspace" element={
          <ProtectedRoute>
            <WorkspaceSelectionPage />
          </ProtectedRoute>
        } />

        <Route path="/portal" element={
          <ProtectedRoute>
            <VendorsProvider>
              <PortalLayout />
            </VendorsProvider>
          </ProtectedRoute>
        }>
          <Route index element={<SubscriptionsPage />} />
          <Route path="company-profile" element={<CompanyProfilePage />} />
          <Route path="admin" element={<VendorAdminPage />} />
          <Route path="profile" element={<UserProfilePage />} />
          <Route path="change-password" element={<ChangePasswordPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/portal" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
