import { Router, Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import { hashPassword, comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";

const DUMMY_HASH = "$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012";

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
    }

    const existing = await db.select().from(users).where(eq(users.email, email));

    if (existing.length > 0) {
        res.status(409).json({ error: "Email already in use" });
        return;
    }

    const hashedPassword = await hashPassword(password);

    const [user] = await db.insert(users).values({
        email,
        password: hashedPassword,
    }).returning({ id: users.id });

    const token = signToken(user.id);

    res.status(201).json({ token });
});

router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
    }

    const [user] = await db.select().from(users).where(eq(users.email, email));

    const hashToCompare = user ? user.password : DUMMY_HASH;
    const valid = await comparePassword(password, hashToCompare);

    if (!user || !valid) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
    }

    const token = signToken(user.id);

    res.json({ token });
});

export default router;
