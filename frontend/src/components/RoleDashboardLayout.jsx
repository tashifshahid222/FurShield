import { Navigate } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout';
import { linksByRole } from './dashboardLinks';
import { useAuth } from '../context/AuthContext';

export const RoleDashboardLayout = () => {
  const { user } = useAuth();

  if (!user?.role) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout links={linksByRole[user.role] || []} />;
};

export default RoleDashboardLayout;