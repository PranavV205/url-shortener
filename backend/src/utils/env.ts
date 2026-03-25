const REQUIRED_VARS = ["DATABASE_URL", "JWT_SECRET", "CORS_ORIGIN"] as const;

export function validateEnv() {
    const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        console.error(`[Startup] Missing required environment variables: ${missing.join(", ")}`);
        process.exit(1);
    }
}
