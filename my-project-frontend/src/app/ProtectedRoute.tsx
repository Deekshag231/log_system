import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authApi } from '@/lib/api';

export default function ProtectedRoute() {
  const location = useLocation();
  if (!authApi.isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
