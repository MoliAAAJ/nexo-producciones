import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";
import Evento from "./models/Evento.js";

import ordenRoutes from "./routes/orden.routes.js";
import mpRoutes from "./routes/mp.routes.js";

const app = express();

// 🔥 MIDDLEWARES
app.use(cors());
app.use(express.json());

// 🔥 ROUTES
app.use("/api", ordenRoutes);
app.use("/mp", mpRoutes);

// 🔥 DB
connectDB();

// 🔥 TEST
app.get("/", (req, res) => {
  res.send("API NEXO funcionando 🚀");
});

app.get("/eventos", async (req, res) => {
  const eventos = await Evento.find();
  res.json(eventos);
});

// 🔥 SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en puerto ${PORT}`);
  console.log("FRONT_URL =", process.env.FRONT_URL); // 👈 DEBUG CLAVE
});
