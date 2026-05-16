"use strict";

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import Evento from "./models/Evento.js";

import ordenRoutes from "./routes/orden.routes.js";
import mpRoutes from "./routes/mp.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import reportesRoutes from "./routes/reportes.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 🌐 CORS
 */
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    process.env.FRONT_URL,
  ].filter(Boolean),
}));

app.use(express.json());

/**
 * 🧠 STATIC FRONTEND (BASE)
 */
app.use(express.static(path.join(__dirname, "../frontend")));

/**
 * 🖼️ ASSETS (OBLIGATORIO PARA IMÁGENES)
 */
app.use(
  "/assets",
  express.static(
    path.join(__dirname, "../frontend/public/assets")
  )
);

/**
 * 🔌 API ROUTES
 */
app.use("/api/orden", ordenRoutes);
app.use("/mp", mpRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reportes", reportesRoutes);

/**
 * 📡 EVENTOS API
 */
app.get("/eventos", async (req, res) => {
  try {
    const eventos = await Evento.find();
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: "Error cargando eventos" });
  }
});

/**
 * 🚨 SPA FALLBACK (ÚLTIMO SIEMPRE)
 */
app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend/pages/index.html")
  );
});

/**
 * 🔥 DB
 */
connectDB();

/**
 * 🚀 SERVER
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on ${PORT}`);
  console.log("🌐 FRONT_URL =", process.env.FRONT_URL);
});
