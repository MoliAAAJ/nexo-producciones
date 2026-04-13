"use strict";

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

import { connectDB } from "./config/db.js";
import Evento from "./models/Evento.js";
import ordenRoutes from "./routes/orden.routes.js";

dotenv.config();

const app = express();

// 🔥 DB primero
connectDB();

// 🔒 seguridad
app.use(helmet());

// 🔒 CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:5500",
      "https://nexoesquel.com",
      "https://www.nexoesquel.com"
    ]
  })
);

// middlewares
app.use(express.json());

// rutas
app.use("/api", ordenRoutes);

// health
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// test
app.get("/", (req, res) => {
  res.send("API NEXO funcionando 🚀");
});

// eventos
app.get("/api/eventos", async (req, res) => {
  try {
    const eventos = await Evento.find();
    console.log(`📊 Eventos enviados: ${eventos.length}`);
    res.json(eventos);
  } catch (error) {
    console.error("❌ Error en /eventos:", error.message);
    res.status(500).json({ error: "Error al obtener eventos" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en puerto ${PORT}`);
});
