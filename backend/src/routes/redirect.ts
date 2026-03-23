import { Router, Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { urls } from "../db/schema";

const router = Router();

router.get("/:shortCode", async (req: Request, res: Response) => {
    const shortCode = req.params.shortCode as string;

    const [url] = await db.select().from(urls).where(eq(urls.shortCode, shortCode));

    if (!url) {
        res.status(404).json({ error: "Short URL not found" });
        return;
    }

    await db.update(urls).set({ clicks: url.clicks + 1 }).where(eq(urls.id, url.id));

    res.redirect(302, url.originalUrl);
});

export default router;
