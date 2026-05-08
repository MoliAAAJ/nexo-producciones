import express from "express";
import { crearOrden, obtenerOrden } from "../controllers/orden.controller.js";

const router = express.Router();

// endpoint compra
router.post("/comprar", crearOrden);
router.get("/orden/:id", obtenerOrden);

export default router;
