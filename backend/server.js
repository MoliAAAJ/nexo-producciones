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
import frontRoutes from "./routes/front.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import reportesRoutes from "./routes/reportes.routes.js";

const app = express();

/**
 * 📁 PATHS
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 🌐 CORS FIX (NGROK + MOBILE + DESKTOP)
 */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      process.env.FRONT_URL, // tu ngrok o dominio real
    ].filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

/**
 * 🔥 MIDDLEWARES
 */
app.use(express.json());

app.use(
  express.static(path.join(__dirname, "../frontend"))
);

app.use(
  "/assets",
  express.static(path.resolve("assets"))
);

/**
 * 🔥 ROUTES
 */
app.use("/api/orden", ordenRoutes);
app.use("/mp", mpRoutes);
app.use("/", frontRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reportes", reportesRoutes);

/**
 * 🔥 DB
 */
connectDB();

/**
 * 🔥 TEST ROUTE
 */
app.get("/", (req, res) => {
  res.send("API NEXO funcionando 🚀");
});

/**
 * 🎟️ EVENTOS
 */
app.get("/eventos", async (req, res) => {
  try {
    const eventos = await Evento.find();
    res.json(eventos);
  } catch (error) {
    console.error("Error /eventos:", error);
    res.status(500).json({
      error: "Error cargando eventos",
    });
  }
});

/**
 * 🚀 SERVER
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en puerto ${PORT}`);
  console.log("FRONT_URL =", process.env.FRONT_URL);
});
