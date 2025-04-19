import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface User {
    token: string;
    username?: string;
    email?: string;
    id: string;
    role: string;
}

interface AuthContextType {
    isLoggedIn: boolean;
    isLoading: boolean;
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Start with true

    // Initialize state from localStorage on app load
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Failed to parse user data', error);
                localStorage.removeItem('user');
            } finally {
                setIsLoading(false); // Set loading to false when done
            }
        };

        initializeAuth();
    }, []); // Empty dependency array to run only once

    const login = (userData: User) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const isLoggedIn = !!user?.token;

    return (
        <AuthContext.Provider value={{
            isLoggedIn,
            user,
            isLoading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};