import express from "express";
import { crearOrden } from "../controllers/orden.controller.js";

const router = express.Router();

// endpoint compra
router.post("/comprar", crearOrden);

export default router;

