"use strict";

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, ".env"),
});

import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";
import Evento from "./models/Evento.js";

import ordenRoutes from "./routes/orden.routes.js";
import mpRoutes from "./routes/mp.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import reportesRoutes from "./routes/reportes.routes.js";

const app = express();

/* =========================
   🔐 MIDDLEWARES BASE
========================= */

app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    process.env.FRONT_URL,
  ].filter(Boolean),
}));

app.use(express.json());

/* =========================
   🧠 STATIC FILES FRONTEND
========================= */

app.use(express.static(path.join(__dirname, "frontend/pages")));

/* 🔵 ASSETS DEL FRONTEND (IMÁGENES, ICONOS, ETC) */

app.use("/assets", express.static(path.join(__dirname, "frontend/public/assets")));

/* 🟢 ASSETS ESPECÍFICOS DEL BACKEND (OPCIONAL) */

app.use("/backend-static", express.static(path.join(__dirname, "assets")));

/* =========================
   🔌 API ROUTES
========================= */

app.use("/api/orden", ordenRoutes);
app.use("/mp", mpRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reportes", reportesRoutes);

/* 📡 EVENTOS API */
app.get("/api/eventos", async (req, res) => {
  try {
    const eventos = await Evento.find();
    res.json(eventos);
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    res.status(500).json({ error: "Error cargando eventos" });
  }
});

/* =========================
   🚨 SPA FALLBACK
========================= */

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "frontend/pages/index.html")
  );
});

/* =========================
   🔥 DB CONNECT
========================= */
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🔥 Server running on http://localhost:${PORT}`);
      console.log("🌐 FRONT_URL =", process.env.FRONT_URL || "Not set (using localhost)");
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
};

startServer();
