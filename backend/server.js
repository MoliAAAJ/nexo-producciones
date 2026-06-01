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

// Logger para ver qué peticiones llegan al servidor
app.use((req, res, next) => {
  console.log(`📡 Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

/* =========================
   🧠 STATIC FILES FRONTEND
========================= */

// 🟡 SERVIR TODA LA CARPETA FRONTEND (JS, STYLES, PAGES, ETC)
app.use(express.static(path.join(__dirname, "frontend")));

// 🔵 ASSETS DEL FRONTEND (IMÁGENES, ICONOS, ETC)
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
  console.log("🔍 Intentando obtener eventos desde la DB...");
  try {
    const eventos = await Evento.find();
    console.log(`✅ Eventos encontrados: ${eventos.length}`);
    res.json(eventos);
  } catch (error) {
    console.error("❌ Error en GET /api/eventos:", error.message);
    res.status(500).json({ error: "Error cargando eventos", debug: error.message });
  }
});

/* 🔐 AUTH LOGIN */
app.post("/api/auth/login", (req, res) => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({ error: "Usuario y contraseña son requeridos" });
    }

    // Validar contra variables de entorno
    const ADMIN_USER = process.env.ADMIN_USER;
    const ADMIN_PASS = process.env.ADMIN_PASS;

    if (usuario === ADMIN_USER && password === ADMIN_PASS && ADMIN_USER && ADMIN_PASS) {
      console.log(`✅ Login exitoso para usuario: ${usuario}`);
      return res.json({ ok: true, message: "Autenticación correcta" });
    }

    console.warn(`⚠️ Intento de login fallido para usuario: ${usuario}`);
    return res.status(401).json({ error: "Credenciales incorrectas" });

  } catch (error) {
    console.error("❌ Error en login:", error.message);
    res.status(500).json({ error: "Error en el servidor" });
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
    // Intentar obtener la IP pública para depuración
    const ipResponse = await fetch('https://api.ipify.org?format=json').catch(() => null);
    const ipData = ipResponse ? await ipResponse.json() : { ip: 'Desconocida' };
    
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🔥 Server running on http://localhost:${PORT}`);
      console.log(`🌍 Server Public IP: ${ipData.ip}`);
      console.log("🌐 FRONT_URL =", process.env.FRONT_URL || "Not set (using localhost)");
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
};

startServer();
