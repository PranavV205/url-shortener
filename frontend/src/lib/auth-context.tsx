"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContext {
    token: string | null;
    setToken: (token: string | null) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setTokenState] = useState<string | null>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setTokenState(localStorage.getItem("token"));
        setLoaded(true);
    }, []);

    function setToken(t: string | null) {
        if (t) {
            localStorage.setItem("token", t);
        } else {
            localStorage.removeItem("token");
        }
        setTokenState(t);
    }

    function logout() {
        setToken(null);
    }

    if (!loaded) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
            </div>
        );
    }

    return (
        <AuthContext value={{ token, setToken, logout }}>
            {children}
        </AuthContext>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
