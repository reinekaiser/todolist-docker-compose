import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connect } from "./config/db.js";
import taskRoutes from "./routes/taskRoute.js";

const port = process.env.PORT || 3000;
dotenv.config({ path: process.cwd() + "/.env" });

const app = express();
connect(app);

app.use(express.json());

const corsOptions = {
    origin: [process.env.CLIENT_URL, "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
    ],
};
app.use(cors(corsOptions));

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.use("/api/tasks", taskRoutes);

app.listen(port, () => {
    console.log(`🚀 Backend is running at http://localhost:${port}`);
});