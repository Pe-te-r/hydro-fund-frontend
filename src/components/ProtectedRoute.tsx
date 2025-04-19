import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'user' | 'admin';
}

const LoadingSpinner = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">Loading...</p>
            </div>
        </div>
    );
};

const ProtectedRoute = ({ children, requiredRole = 'user' }: ProtectedRouteProps) => {
    const { user,isLoading } = useAuth();
    const location = useLocation();
    console.log(user)

    if (isLoading) {
        return <LoadingSpinner/>
    }

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