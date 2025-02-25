import { createContext, ReactNode, useContext, useState } from "react";
import apiClient from "../api/client";
import { endpoints } from "../api/endpoints";

interface User {
    email: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (credentials: { email: string, password: string }) => Promise<void>;
    logout: () => void;
    refreshUser: () => void;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [ user, setUser ] = useState<User | null>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ error, setError ] = useState<string | null>(null);

    const isAuthenticated = !!user;

    const refreshUser = async () => {
        setIsLoading(true);
        try {
            // Fetch user data
            const response: { data: {email: string} } = await apiClient.get(endpoints.auth.user);
            setUser(response.data);
            setError(null);
        } catch (err: any) {
            if (err.response && err.response.status === 401) {
                setUser(null);
            } else {
                setError(err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials: { email: string, password: string }) => {
        setIsLoading(true);
        try {
            // Login user
            const response = await apiClient.post(endpoints.auth.login, credentials);
            await refreshUser();
            setError(null);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            // Logout user
            await apiClient.post(endpoints.auth.logout);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUser(null);
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, error, login, logout, refreshUser, isAuthenticated }}>
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