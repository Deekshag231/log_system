import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './Layout';
import ProtectedRoute from './ProtectedRoute';
import HomePage from '@/pages/HomePage';
import DashboardPage from '@/pages/DashboardPage';
import IngestPage from '@/pages/IngestPage';
import SearchPage from '@/pages/SearchPage';
import RecentPage from '@/pages/RecentPage';
import AlertsPage from '@/pages/AlertsPage';
import SettingsPage from '@/pages/SettingsPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'ingest', element: <IngestPage /> },
          { path: 'search', element: <SearchPage /> },
          { path: 'recent', element: <RecentPage /> },
          { path: 'alerts', element: <AlertsPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
