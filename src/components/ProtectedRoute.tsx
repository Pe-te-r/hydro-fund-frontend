import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'user' | 'admin';
}



const ProtectedRoute = ({ children, requiredRole = 'user' }: ProtectedRouteProps) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        // Store the attempted path before redirecting to login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole === 'admin' && user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;