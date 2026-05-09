import express from "express";
import {
  crearOrden,
  obtenerOrden,
  descargarTicketPDF
} from "../controllers/orden.controller.js";

const router = express.Router();

// endpoint compra
router.post("/comprar", crearOrden);
router.get("/orden/:id", obtenerOrden);

router.get(
  "/ticket/:id/pdf",
  descargarTicketPDF
);

export default router;
