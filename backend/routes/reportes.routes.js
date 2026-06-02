import express from "express";
import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";
import Evento from "../models/Evento.js";
import Orden from "../models/Orden.js";
import { isAdmin } from "../middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.use(isAdmin);

function formatCurrency(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS"
  }).format(Number(value || 0));
}

function formatDate(date) {
  return new Date(date).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

router.get("/eventos/:id/pdf", async (req, res) => {

  try {

    const evento = await Evento.findById(req.params.id);

    if (!evento) {
      return res.status(404).send("Evento no encontrado");
    }

    const ordenes = await Orden.find({
      evento_id: evento._id,
      estado: "pagado"
    }).sort({ createdAt: 1 });

    const totalEntradas = ordenes.reduce((acc, orden) => {
      return acc + orden.items.reduce((sum, item) => sum + Number(item.cantidad || 0), 0);
    }, 0);

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${evento.nombre}.pdf`
    );

    doc.pipe(res);

    const logoPath = path.join(
      __dirname,
      "../assets/logo.png"
    );

    try {
      doc.image(logoPath, {
        fit: [110, 110],
        align: "center"
      });
    } catch {
      // no-op
    }

    doc.moveDown();

    doc.fillColor("#111827");
    doc.fontSize(22).font("Helvetica-Bold")
      .text("Control de ingreso", { align: "center" });

    doc.fontSize(14).font("Helvetica")
      .text(evento.nombre, { align: "center" });

    doc.moveDown(1.5);

    doc.fillColor("#1f2937");
    doc.fontSize(10)
      .text(`Fecha: ${formatDate(evento.fecha)}`)
      .text(`Lugar: ${evento.lugar || "Lugar a confirmar"}`)
      .text(`Localidad: ${evento.localidad || "Localidad a confirmar"}`)
      .text(`Dirección: ${evento.direccion || "Dirección a confirmar"}`);

    doc.moveDown(1);

    doc.fillColor("#7c3aed");
    doc.fontSize(12).font("Helvetica-Bold")
      .text(`Compradores: ${ordenes.length}`);
    doc.fontSize(12).font("Helvetica-Bold")
      .text(`Entradas vendidas: ${totalEntradas}`);

    if (ordenes.length === 0) {
      doc.moveDown(1);
      doc.fillColor("#111827");
      doc.fontSize(11)
        .text("No hay compras confirmadas para este evento.");
      doc.end();
      return;
    }

    doc.moveDown(1.5);

    ordenes.forEach((orden, index) => {
      const totalEntradas = orden.items.reduce(
        (acc, item) => acc + Number(item.cantidad || 0),
        0
      );

      const tipos = orden.items
        .map(item => `${item.tipo} x${item.cantidad}`)
        .join(" • ");

      doc.fillColor("#111827");
      doc.fontSize(11).font("Helvetica-Bold")
        .text(`${index + 1}. ${orden.cliente.nombre} ${orden.cliente.apellido}`);

      doc.fontSize(10).font("Helvetica");
      doc.fillColor("#111827");
      doc.text(`DNI: ${orden.cliente.dni}`);
      doc.text(`Teléfono: ${orden.cliente.telefono || "No informado"}`);
      doc.text(`Email: ${orden.cliente.email}`);
      doc.text(`Entradas: ${totalEntradas}`);
      doc.text(`Detalle: ${tipos}`);
      doc.text(`Total abonado: ${formatCurrency(orden.total)}`);
      doc.moveDown(0.7);
    });

    doc.end();

  } catch (error) {

    console.error(error);

    res.status(500).send("Error generando PDF");

  }

});

export default router;
