import { Router, Request, Response } from "express";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "../db";
import { urls } from "../db/schema";
import { authenticate } from "../middleware/auth";
import { validateUrl, validateUuid } from "../utils/validate";
import { asyncHandler } from "../middleware/error";

const router = Router();

router.post("/", authenticate, asyncHandler(async (req: Request, res: Response) => {
    const { url } = req.body;

    const urlError = validateUrl(url);
    if (urlError) { res.status(400).json({ error: urlError }); return; }

    const MAX_RETRIES = 3;
    for (let i = 0; i < MAX_RETRIES; i++) {
        const shortCode = nanoid(8);
        try {
            const [created] = await db.insert(urls).values({
                shortCode,
                originalUrl: url,
                userId: req.userId!,
            }).returning();

            res.status(201).json(created);
            return;
        } catch (err: unknown) {
            const isUniqueViolation = err instanceof Error && err.message.includes("unique");
            if (!isUniqueViolation || i === MAX_RETRIES - 1) throw err;
        }
    }
}));

router.get("/", authenticate, asyncHandler(async (req: Request, res: Response) => {
    const userUrls = await db.select().from(urls).where(eq(urls.userId, req.userId!));

    res.json(userUrls);
}));

router.delete("/:id", authenticate, asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const idError = validateUuid(id);
    if (idError) { res.status(400).json({ error: idError }); return; }

    const [deleted] = await db.delete(urls).where(
        and(eq(urls.id, id), eq(urls.userId, req.userId!))
    ).returning();

    if (!deleted) {
        res.status(404).json({ error: "URL not found" });
        return;
    }

    res.json({ message: "URL deleted" });
}));

export default router;
