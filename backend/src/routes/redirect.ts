import { Router, Request, Response } from "express";
import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { urls } from "../db/schema";
import { asyncHandler } from "../middleware/error";

const router = Router();

router.get("/:shortCode", asyncHandler(async (req: Request, res: Response) => {
    const shortCode = req.params.shortCode as string;

    const [url] = await db.select().from(urls).where(eq(urls.shortCode, shortCode));

    if (!url) {
        res.status(404).json({ error: "Short URL not found" });
        return;
    }

    await db.update(urls).set({ clicks: sql`${urls.clicks} + 1` }).where(eq(urls.id, url.id));

    res.redirect(302, url.originalUrl);
}));

export default router;
