import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loading } from './Loading';

export const ProtectedRoute = ({ children }) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading text="Checking session..." />;
  }

  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export const RoleRoute = ({ roles, children }) => {
  const { user } = useAuth();

  if (!roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;