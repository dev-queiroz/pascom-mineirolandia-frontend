import type {User} from "./user.ts";

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (credentials: { username: string; password: string }) => Promise<void>;
    logout: () => void;
    loadUser: () => Promise<void>;
}