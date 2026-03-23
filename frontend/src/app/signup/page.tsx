"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { signup } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { setToken } = useAuth();
    const router = useRouter();

    function validate(): string | null {
        if (!email.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format";
        if (password.length < 8) return "Password must be at least 8 characters";
        if (password.length > 128) return "Password must be at most 128 characters";
        return null;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        const validationError = validate();
        if (validationError) { setError(validationError); return; }

        setLoading(true);

        try {
            const data = await signup(email, password);
            setToken(data.token);
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Signup failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Sign up</CardTitle>
                    <CardDescription>Create an account to get started</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Creating account..." : "Sign up"}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/login" className="underline text-foreground">
                                Log in
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
