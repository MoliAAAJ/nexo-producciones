import express from "express";
import PDFDocument from "pdfkit";
import path from "path";
import Evento from "../models/Evento.js";
import Orden from "../models/Orden.js";

const router = express.Router();

router.get("/eventos/:id/pdf", async (req, res) => {

  try {

    const evento = await Evento.findById(req.params.id);

    if (!evento) {
      return res.status(404).send("Evento no encontrado");
    }

    const ordenes = await Orden.find({
      evento_id: evento._id,
      estado: "pagado"
    });

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${evento.nombre}.pdf`
    );

    doc.pipe(res);

    // 🖼️ LOGO
    const logoPath = path.join(
      process.cwd(),
      "../frontend/public/assets/images/branding/nexo_logo_transparente.png"
    );

    doc.image(logoPath, {
      fit: [120, 120],
      align: "center"
    });

    doc.moveDown();

    // 🧾 TITULO
    doc.fontSize(20)
      .text("NEXO PRODUCCIONES", { align: "center" });

    doc.fontSize(14)
      .text(evento.nombre, { align: "center" });

    doc.moveDown(2);

    doc.fontSize(12)
      .text("Listado de compradores", { underline: true });

    doc.moveDown();

    // 📄 LISTADO
    ordenes.forEach((o, i) => {

      const totalEntradas = o.items.reduce(
        (acc, it) => acc + it.cantidad,
        0
      );

      doc.fontSize(10).text(
        `${i + 1}. ${o.cliente.nombre} ${o.cliente.apellido}`
      );

      doc.text(`DNI: ${o.cliente.dni}`);
      doc.text(`Teléfono: ${o.cliente.telefono || "No informado"}`);
      doc.text(`Email: ${o.cliente.email}`);
      doc.text(`Entradas: ${totalEntradas}`);

      doc.moveDown();

    });

    doc.end();

  } catch (error) {

    console.error(error);

    res.status(500).send("Error generando PDF");

  }

});

export default router;
