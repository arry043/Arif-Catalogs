import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import productRoutes from "./routes/product.routes";
import { errorHandler } from "./middleware/error.handler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(helmet());
const allowedOrigins = (
    process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:5174"
)
    .split(",")
    .map((s) => s.trim());
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true); // allow server-to-server or curl
            if (allowedOrigins.includes(origin)) return callback(null, true);
            return callback(new Error("CORS_NOT_ALLOWED"));
        },
    }),
);
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

// Routes
app.use("/api/v1", productRoutes);

// Health check
app.get("/api/v1/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Global Error Handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    // Server started
});

export { app };
