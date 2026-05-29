import express from "express";
import {
  crearOrden,
  obtenerOrden,
  descargarTicketPDF,
  validarCupon
} from "../controllers/orden.controller.js";

const router = express.Router();

// ENDPOINTS COMPRA
router.post("/", crearOrden);
router.get("/cupon/:codigo", validarCupon);
router.get("/:id", obtenerOrden);

router.get(
  "/ticket/:id/pdf",
  descargarTicketPDF
);

export default router;
