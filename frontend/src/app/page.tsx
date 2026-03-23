"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
    const { token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (token) router.replace("/dashboard");
    }, [token, router]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <main className="flex flex-col items-center gap-8 text-center px-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-bold tracking-tight">
                        URL Shortener
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Shorten links, manage URLs, and track clicks.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/login" className={buttonVariants()}>
                        Log in
                    </Link>
                    <Link href="/signup" className={buttonVariants({ variant: "outline" })}>
                        Sign up
                    </Link>
                </div>
            </main>
        </div>
    );
}
