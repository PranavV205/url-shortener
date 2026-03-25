import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import urlRoutes from "./routes/url";
import redirectRoutes from "./routes/redirect";
import { errorHandler } from "./middleware/error";

import { validateEnv } from "./utils/env";

dotenv.config();
validateEnv();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
    res.status(200).type("text/plain").send("Healthy");
});

app.use("/api/auth", authRoutes);
app.use("/api/urls", urlRoutes);
app.use(redirectRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`[Server] Server listening on port ${PORT}`);
});
