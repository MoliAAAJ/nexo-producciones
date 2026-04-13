import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import Evento from "./models/Evento.js";

dotenv.config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// conectar DB
connectDB();

// test route
app.get("/", (req, res) => {
  res.send("API NEXO funcionando 🚀");
});

// obtener eventos
app.get("/eventos", async (req, res) => {
  try {
    const eventos = await Evento.find();

    console.log("📦 DB actual:", Evento.db.name);
    console.log("📊 Cantidad de eventos:", eventos.length);

    res.json(eventos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener eventos" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en puerto ${PORT}`);
});
