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
import VendorListingPage from './features/portal/pages/VendorListingPage';
import ChangePasswordPage from './features/auth/pages/ChangePasswordPage';
import UserProfilePage from './features/portal/pages/UserProfilePage';
import MyBenefitsPage from './features/portal/pages/MyBenefitsPage';
import ProtectedRoute from './components/guards/ProtectedRoute';
import RoleGuard from './components/guards/RoleGuard';
import BackofficeLayout from './layouts/BackofficeLayout';
import VendorsListPage from './features/backoffice/pages/VendorsListPage';
import VendorDetailPage from './features/backoffice/pages/VendorDetailPage';
import OnboardingPage from './features/backoffice/pages/OnboardingPage';
import BenefitTrackerPage from './features/backoffice/pages/BenefitTrackerPage';
import BenefitBuildsPage from './features/backoffice/pages/BenefitBuildsPage';
import OpsVendorSetupPage from './features/backoffice/pages/OpsVendorSetupPage';
import VendorOnboardingPage from './features/portal/pages/VendorOnboardingPage';
import UserManagementPage from './features/settings/pages/UserManagementPage';
import ActivityLogsPage from './features/settings/pages/ActivityLogsPage';
import NotificationsPage from './features/notifications/pages/NotificationsPage';

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
          <Route path="vendor-listing" element={<VendorListingPage />} />
          <Route path="admin" element={<VendorAdminPage />} />
          <Route path="benefits" element={<MyBenefitsPage />} />
          <Route path="profile" element={<UserProfilePage />} />
          <Route path="change-password" element={<ChangePasswordPage />} />
          <Route path="onboarding" element={<VendorOnboardingPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        <Route path="/backoffice" element={
          <ProtectedRoute>
            <BackofficeLayout />
          </ProtectedRoute>
        }>
          <Route index element={
            <RoleGuard allowedRoles={['SUPER_ADMIN', 'ADMIN', 'VSM', 'OPERATIONS']}>
              <Navigate to="onboarding" replace />
            </RoleGuard>
          } />

          <Route element={<RoleGuard allowedRoles={['SUPER_ADMIN', 'ADMIN', 'VSM']} />}>
            <Route path="vendors" element={<VendorsListPage />} />
          </Route>
          <Route element={<RoleGuard allowedRoles={['SUPER_ADMIN', 'ADMIN', 'VSM', 'OPERATIONS']} />}>
            <Route path="vendors/:id" element={<VendorDetailPage />} />
          </Route>

          <Route element={<RoleGuard allowedRoles={['SUPER_ADMIN', 'ADMIN', 'VSM', 'OPERATIONS']} />}>
            <Route path="onboarding" element={<OnboardingPage />} />
          </Route>

          <Route element={<RoleGuard allowedRoles={['VSM', 'SUPER_ADMIN', 'ADMIN']} />}>
            <Route path="benefit-tracker" element={<BenefitTrackerPage />} />
          </Route>

          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<UserProfilePage />} />
          <Route path="change-password" element={<ChangePasswordPage />} />

          <Route element={<RoleGuard allowedRoles={['SUPER_ADMIN', 'OPERATIONS']} />}>
            <Route path="vendor-setup" element={<OpsVendorSetupPage />} />
            <Route path="benefit-builds" element={<BenefitBuildsPage />} />
          </Route>

          <Route element={<RoleGuard allowedRoles={['SUPER_ADMIN']} />}>
            <Route path="users" element={<UserManagementPage />} />
            <Route path="activity-logs" element={<ActivityLogsPage />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/portal" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
