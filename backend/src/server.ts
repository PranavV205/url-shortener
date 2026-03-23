import dotenv from "dotenv";
import express, { Request, Response } from "express";
import authRoutes from "./routes/auth";
import urlRoutes from "./routes/url";
import redirectRoutes from "./routes/redirect";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
    res.status(200).type("text/plain").send("Healthy");
});

app.use("/api/auth", authRoutes);
app.use("/api/urls", urlRoutes);
app.use(redirectRoutes);

app.listen(PORT, () => {
    console.log(`[Server] Server listening on port ${PORT}`);
});
