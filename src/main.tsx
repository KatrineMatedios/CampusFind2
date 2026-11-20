import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@/styles/global.css";

// Layouts and guards
import AuthLayout from "@/components/layout/AuthLayout";
import AppLayout from "@/components/layout/AppLayout";
import AdminLayout from "@/layouts/AdminLayout";
import { AuthProvider } from "@/components/auth/AuthProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminRoute from "@/components/auth/AdminRoute";
import GuestRoute from "@/components/auth/GuestRoute";

// Auth pages
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import CheckEmailPage from "@/pages/auth/CheckEmailPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";

// App pages
import HomePage from "@/pages/home/HomePage";
import ReportItemPage from "@/pages/report/ReportItemPage";
import BrowsePage from "@/pages/items/BrowsePage";
import LostItemsPage from "@/pages/items/LostItemsPage";
import FoundItemsPage from "@/pages/items/FoundItemsPage";
import ItemDetailsPage from "@/pages/items/ItemDetailsPage";
import ResolvedItemsPage from "@/pages/items/ResolvedItemsPage";
import VerifyOwnershipPage from "@/pages/claims/VerifyOwnershipPage";
import MyReportsPage from "@/pages/my-reports/MyReportsPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import PersonalInformationPage from "@/pages/profile/PersonalInformationPage";
import ActivityHistoryPage from "@/pages/profile/ActivityHistoryPage";
import NotificationsPage from "@/pages/profile/NotificationsPage";
import HelpSupportPage from "@/pages/profile/HelpSupportPage";
import NotFoundPage from "@/pages/NotFoundPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import UsersPage from "@/pages/admin/UsersPage";
import ReportsPage from "@/pages/admin/ReportsPage";
import FlagsPage from "@/pages/admin/FlagsPage";
import ItemsDatabasePage from "@/pages/admin/ItemsDatabasePage";
import AuditLogsPage from "@/pages/admin/AuditLogsPage";
import SettingsPage from "@/pages/admin/SettingsPage";
import AdminNotificationsPage from "@/pages/admin/AdminNotificationsPage";

const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/register", element: <RegisterPage /> },
          { path: "/forgot-password", element: <ForgotPasswordPage /> },
          { path: "/check-email", element: <CheckEmailPage /> },
          { path: "/reset-password", element: <ResetPasswordPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/", element: <HomePage /> },
          { path: "/report", element: <ReportItemPage /> },
          { path: "/browse", element: <BrowsePage /> },
          { path: "/items/lost", element: <LostItemsPage /> },
          { path: "/items/found", element: <FoundItemsPage /> },
          { path: "/items/:id", element: <ItemDetailsPage /> },
          { path: "/items/:id/claim", element: <VerifyOwnershipPage /> },
          { path: "/resolved", element: <ResolvedItemsPage /> },
          { path: "/my-reports", element: <MyReportsPage /> },
          { path: "/profile", element: <ProfilePage /> },
          {
            path: "/profile/personal-information",
            element: <PersonalInformationPage />,
          },
          { path: "/profile/activity", element: <ActivityHistoryPage /> },
          { path: "/notifications", element: <NotificationsPage /> },
          { path: "/help", element: <HelpSupportPage /> },
        ],
      },
    ],
  },
  {
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "/admin", element: <AdminDashboardPage /> },
          { path: "/admin/users", element: <UsersPage /> },
          { path: "/admin/reports", element: <ReportsPage /> },
          { path: "/admin/flags", element: <FlagsPage /> },
          { path: "/admin/items", element: <ItemsDatabasePage /> },
          { path: "/admin/audit", element: <AuditLogsPage /> },
          { path: "/admin/settings", element: <SettingsPage /> },
          { path: "/admin/notifications", element: <AdminNotificationsPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
