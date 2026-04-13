import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import Evento from "./models/Evento.js";

dotenv.config();

const app = express();

// 🔒 CORS CONFIGURADO
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

// conectar DB
connectDB();

// health check (clave para deploy)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// test route
app.get("/", (req, res) => {
  res.send("API NEXO funcionando 🚀");
});

// obtener eventos
app.get("/eventos", async (req, res) => {
  try {
    const eventos = await Evento.find();

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
