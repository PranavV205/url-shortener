const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;
const MAX_URL_LENGTH = 2048;

export function validateEmail(email: string): string | null {
    if (typeof email !== "string" || !email.trim()) return "Email is required";
    if (!EMAIL_REGEX.test(email)) return "Invalid email format";
    return null;
}

export function validatePassword(password: string): string | null {
    if (typeof password !== "string" || !password) return "Password is required";
    if (password.length < MIN_PASSWORD_LENGTH) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    if (password.length > MAX_PASSWORD_LENGTH) return `Password must be at most ${MAX_PASSWORD_LENGTH} characters`;
    return null;
}

export function validateUrl(url: string): string | null {
    if (typeof url !== "string" || !url.trim()) return "URL is required";
    if (url.length > MAX_URL_LENGTH) return `URL must be at most ${MAX_URL_LENGTH} characters`;

    try {
        const parsed = new URL(url);
        if (!["http:", "https:"].includes(parsed.protocol)) return "URL must use http or https";
    } catch {
        return "Invalid URL";
    }

    return null;
}

export function validateUuid(id: string): string | null {
    if (typeof id !== "string") return "Invalid ID";
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!UUID_REGEX.test(id)) return "Invalid ID format";
    return null;
}
