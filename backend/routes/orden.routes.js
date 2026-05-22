import express from "express";
import {
  crearOrden,
  obtenerOrden,
  descargarTicketPDF
} from "../controllers/orden.controller.js";

const router = express.Router();

// ENDPOINTS COMPRA
router.post("/", crearOrden);
router.get("/:id", obtenerOrden);

router.get(
  "/ticket/:id/pdf",
  descargarTicketPDF
);

export default router;
