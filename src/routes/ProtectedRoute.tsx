import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../contexts/authStore';
import {type JSX} from "react";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}