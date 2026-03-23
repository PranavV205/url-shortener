const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function request(path: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Something went wrong");

    return data;
}

export function signup(email: string, password: string) {
    return request("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
}

export function login(email: string, password: string) {
    return request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
}

export function createUrl(url: string) {
    return request("/api/urls", {
        method: "POST",
        body: JSON.stringify({ url }),
    });
}

export function getUrls() {
    return request("/api/urls");
}

export function deleteUrl(id: string) {
    return request(`/api/urls/${id}`, { method: "DELETE" });
}
