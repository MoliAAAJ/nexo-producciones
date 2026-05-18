import path from "path";
import PDFDocument from "pdfkit";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generarPDF = (ticket, orden) => {

  return new Promise((resolve, reject) => {

    const doc = new PDFDocument({
      size: "A4",
      margin: 50
    });

    /**
     * 🔥 LOGO
     */
    const logoPath = path.join(
      __dirname,
      "../../frontend/public/assets/images/branding/nexo_logo_transparente.png"
    );

    const buffers = [];

    doc.on(
      "data",
      buffers.push.bind(buffers)
    );

    doc.on("end", () => {

      const pdfData =
        Buffer.concat(buffers);

      resolve(pdfData);

    });

    /**
     * 🎨 BACKGROUND
     */
    doc
      .rect(0, 0, doc.page.width, doc.page.height)
      .fill("#0f0f12");

    doc.fillColor("white");

    /**
     * 🖼️ LOGO
     */
    try {

      doc.image(
        logoPath,
        (doc.page.width - 80) / 2,
        20,
        {
          fit: [80, 80],
          align: "center"
        }
      );

    } catch (error) {

      console.log("⚠️ Logo no encontrado");
      console.log(error);

    }

    /**
     * 🔥 POSICIÓN MANUAL
     */
    doc.y = 115;

    /**
     * 🎵 EVENTO
     */
    const nombreEvento =
      orden.evento_id?.nombre ||
      "EVENTO";

    doc
      .fontSize(24)
      .fillColor("#a855f7")
      .text(
        nombreEvento,
        {
          align: "center"
        }
      );

    doc.moveDown(1.5);

    /**
     * 👤 CLIENTE
     */
    doc
      .fontSize(14)
      .fillColor("white");

    doc.text(
      `Cliente: ${orden.cliente.nombre} ${orden.cliente.apellido}`
    );

    doc.moveDown(0.7);

    /**
     * 🎟️ TIPO
     */
    doc.text(
      `Tipo entrada: ${ticket.tipo}`
    );

    doc.moveDown(0.7);

    /**
     * 📍 LUGAR
     */
    doc.text(
      `Lugar: ${
        orden.evento_id?.lugar ||
        "Lugar a confirmar"
      }`
    );

    doc.moveDown(0.7);

    /**
     * 📅 FECHA
     */
    const fechaEvento =
      orden.evento_id?.fecha
        ? new Date(
            orden.evento_id.fecha
          ).toLocaleDateString("es-AR")
        : "Fecha a confirmar";

    doc.text(
      `Fecha: ${fechaEvento}`
    );

    doc.moveDown(0.7);

    /**
     * 🕒 HORA
     */
    const horaEvento =
      orden.evento_id?.fecha
      ? new Date(
        orden.evento_id.fecha
        ).toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        })
      : "Horario a confirmar";

    doc.text(`Hora: ${horaEvento} hs`);

    doc.moveDown(1.5);

    /**
     * 🎟️ QR TITLE
     */
    doc
      .fontSize(16)
      .fillColor("#22c55e")
      .text(
        "Escaneá este QR en puerta",
        {
          align: "center"
        }
      );

    doc.moveDown(1);

    /**
     * 🔥 QR
     */
    const qrSize = 150;

    const x =
      (doc.page.width - qrSize) / 2;

    doc.image(

      Buffer.from(
        ticket.qr_code.split(",")[1],
        "base64"
      ),

      x,

      doc.y,

      {
        width: qrSize,
        height: qrSize
      }

    );

    /**
     * 🔥 BAJAR MANUALMENTE
     */
    doc.y += 170;

    /**
     * 🔑 CODE
     */
    doc
      .fontSize(16)
      .fillColor("#a855f7")
      .text(

        `Código: NEXO-${ticket._id
          .toString()
          .slice(-5)}`,

        {
          align: "center"
        }

      );

    doc.moveDown(1);

    /**
     * 🦶 FOOTER
     */
    doc
      .fontSize(11)
      .fillColor("#9ca3af")
      .text(
        "Presentar este ticket al ingresar al evento",
        {
          align: "center"
        }
      );

    doc.moveDown(0.5);

    doc
      .fontSize(10)
      .fillColor("#6b7280")
      .text(
        "NEXO Tickets • Powered by MercadoPago",
        {
          align: "center"
        }
      );

    doc.end();

  });

};
