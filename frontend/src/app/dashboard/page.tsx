"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { createUrl, getUrls, deleteUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface Url {
    id: string;
    shortCode: string;
    originalUrl: string;
    clicks: number;
    createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DashboardPage() {
    const { token, logout } = useAuth();
    const router = useRouter();
    const [urls, setUrls] = useState<Url[]>([]);
    const [newUrl, setNewUrl] = useState("");
    const [error, setError] = useState("");
    const [creating, setCreating] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);

    const fetchUrls = useCallback(async () => {
        try {
            const data = await getUrls();
            setUrls(data);
        } catch {
            setError("Failed to load URLs");
        }
    }, []);

    useEffect(() => {
        if (!token) {
            router.replace("/login");
            return;
        }
        fetchUrls();
    }, [token, router, fetchUrls]);

    function validateInput(url: string): string | null {
        if (!url.trim()) return "URL is required";
        if (url.length > 2048) return "URL must be at most 2048 characters";
        try {
            const parsed = new URL(url);
            if (!["http:", "https:"].includes(parsed.protocol)) return "URL must use http or https";
        } catch {
            return "Invalid URL";
        }
        return null;
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        const urlError = validateInput(newUrl);
        if (urlError) { setError(urlError); return; }

        setCreating(true);

        try {
            await createUrl(newUrl);
            setNewUrl("");
            fetchUrls();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create URL");
        } finally {
            setCreating(false);
        }
    }

    async function handleDelete(id: string) {
        try {
            await deleteUrl(id);
            setUrls(urls.filter((u) => u.id !== id));
        } catch {
            setError("Failed to delete URL");
        } finally {
            setDeleting(null);
        }
    }

    function handleCopy(shortCode: string) {
        const shortUrl = `${API_URL}/${shortCode}`;
        navigator.clipboard.writeText(shortUrl);
        setCopied(shortCode);
        setTimeout(() => setCopied(null), 2000);
    }

    if (!token) return null;

    return (
        <div className="min-h-screen p-6 md:p-10">
            <div className="mx-auto max-w-4xl flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <Button variant="outline" onClick={logout}>
                        Log out
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Shorten a URL</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="flex gap-3">
                            <Input
                                placeholder="https://example.com/very-long-url"
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                                required
                                className="flex-1"
                            />
                            <Button type="submit" disabled={creating}>
                                {creating ? "Creating..." : "Shorten"}
                            </Button>
                        </form>
                        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Your URLs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {urls.length === 0 ? (
                            <p className="text-muted-foreground text-sm">
                                No URLs yet. Create one above.
                            </p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Short URL</TableHead>
                                        <TableHead>Original URL</TableHead>
                                        <TableHead className="text-center">Clicks</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {urls.map((url) => (
                                        <TableRow key={url.id}>
                                            <TableCell className="font-mono text-sm">
                                                {url.shortCode}
                                            </TableCell>
                                            <TableCell className="max-w-50 truncate text-sm text-muted-foreground">
                                                {url.originalUrl}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {url.clicks}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleCopy(url.shortCode)}
                                                    >
                                                        {copied === url.shortCode ? "Copied!" : "Copy"}
                                                    </Button>
                                                    <Dialog open={deleting === url.id} onOpenChange={(open) => setDeleting(open ? url.id : null)}>
                                                        <DialogTrigger render={<Button variant="destructive" size="sm" />}>
                                                            Delete
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Delete URL</DialogTitle>
                                                                <DialogDescription>
                                                                    This will permanently delete this short link. This action cannot be undone.
                                                                    <span className="mt-2 flex flex-col gap-1 rounded-md bg-muted p-2 text-xs">
                                                                        <span><span className="text-muted-foreground">Short code:</span> <span className="font-mono font-medium text-foreground">{url.shortCode}</span></span>
                                                                        <span className="truncate"><span className="text-muted-foreground">Original:</span> <span className="font-medium text-foreground">{url.originalUrl}</span></span>
                                                                    </span>
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <DialogFooter>
                                                                <DialogClose render={<Button variant="outline" />}>
                                                                    Cancel
                                                                </DialogClose>
                                                                <Button variant="destructive" onClick={() => handleDelete(url.id)}>
                                                                    Delete
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
