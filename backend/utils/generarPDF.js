import path from "path";
import PDFDocument from "pdfkit";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generarPDF = (ticket, orden) => {

  return new Promise((resolve, reject) => {

    const doc = new PDFDocument({
      size: "A4",
      margin: 40
    });

    const logoPath = path.join(
      __dirname,
      "../../frontend/public/assets/images/branding/nexo_logo_transparente.png"
    );

    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));

    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
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
        (doc.page.width - 70) / 2,
        18,
        {
          fit: [70, 70],
          align: "center"
        }
      );

    } catch (error) {
      console.log("⚠️ Logo no encontrado");
    }

    doc.y = 90;

    /**
     * 🎵 EVENTO
     */
    const nombreEvento =
      orden.evento_id?.nombre || "EVENTO";

    doc
      .fontSize(22)
      .fillColor("#a855f7")
      .font("Helvetica-Bold")
      .text(
        nombreEvento,
        40,
        doc.y,
        {
          width: doc.page.width - 80,
          align: "center"
        }
      );

    doc.moveDown(0.8);

    /**
     * 🎟️ CARD INFO
     */
    const startX = 55;
    const startY = doc.y;

    doc
      .roundedRect(
        startX,
        startY,
        500,
        340,
        18
      )
      .fill("#18181b");

    doc.fillColor("white");

    /**
     * HELPERS
     */
    const label = (txt, y, x = 75) => {
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor("#a1a1aa")
        .text(txt, x, y);
    };

    const value = (txt, y, x = 75) => {
      doc
        .font("Helvetica")
        .fontSize(13)
        .fillColor("white")
        .text(txt, x, y + 14);
    };

    const fechaEvento =
      orden.evento_id?.fecha
        ? new Date(
            orden.evento_id.fecha
          ).toLocaleDateString("es-AR")
        : "Fecha a confirmar";

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

    /**
     * 🔢 ITEM ORDEN
     */
    const itemOrden = orden.items?.find(
      i => i.tipo === ticket.tipo
    );

    /**
     * 👤 ASISTENTE
     */
    label("ASISTENTE", startY + 18);

    value(
      `${orden.cliente.nombre} ${orden.cliente.apellido}`,
      startY + 18
    );

    /**
     * 📞 TELÉFONO
     */
    label("TELÉFONO", startY + 58);

    value(
      `${orden.cliente.telefono || "No informado"}`,
      startY + 58
    );

    /**
     * 🎟️ ENTRADA
     */
    label("ENTRADA", startY + 98);

    value(
      ticket.tipo,
      startY + 98
    );

    /**
     * 🔢 CANTIDAD
     */
    label("CANTIDAD", startY + 138);

    value(
      `${itemOrden?.cantidad || 1} entrada(s)`,
      startY + 138
    );

    /**
     * 💰 TOTAL
     */
    label("TOTAL ABONADO", startY + 178);

    value(
      `$${orden.total || 0}`,
      startY + 178
    );

    /**
     * 📍 LUGAR
     */
    label("LUGAR", startY + 218);

    value(
      `${orden.evento_id?.lugar || "Lugar a confirmar"}`,
      startY + 218
    );

    /**
     * 📌 DIRECCIÓN
     */
    label("DIRECCIÓN", startY + 258);

    value(
      `${orden.evento_id?.direccion || "Dirección a confirmar"}`,
      startY + 258
    );

    /**
     * 🌎 LOCALIDAD
     */
    label("LOCALIDAD", startY + 298);

    value(
      `${orden.evento_id?.localidad || "Localidad a confirmar"}`,
      startY + 298
    );

    /**
     * 📅 FECHA
     */
    label("FECHA", startY + 18, 360);

    value(
      fechaEvento,
      startY + 18,
      360
    );

    /**
     * 🕒 HORA
     */
    label("HORA", startY + 98, 360);

    value(
      `${horaEvento} hs`,
      startY + 98,
      360
    );

    /**
     * 🔥 QR SECTION
     */
    doc.y = startY + 375;

    doc
      .fontSize(15)
      .font("Helvetica-Bold")
      .fillColor("#22c55e")
      .text(
        "Escaneá este código al ingresar",
        40,
        doc.y,
        {
          width: doc.page.width - 80,
          align: "center"
        }
      );

    doc.moveDown(0.6);

    /**
     * 🔳 QR
     */
    const qrSize = 110;

    const qrX =
      (doc.page.width - qrSize) / 2;

    doc.image(
      Buffer.from(
        ticket.qr_code.split(",")[1],
        "base64"
      ),
      qrX,
      doc.y,
      {
        width: qrSize,
        height: qrSize
      }
    );

    doc.y += 125;

    /**
     * 🦶 FOOTER
     */
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#9ca3af")
      .text(
        "Presentarse con este ticket digital en el ingreso 15 minutos antes del comienzo del evento.",
        40,
        doc.y,
        {
          width: doc.page.width - 80,
          align: "center"
        }
      );

    doc.moveDown(0.3);

    doc
      .fontSize(8)
      .fillColor("#6b7280")
      .text(
        "NEXO Tickets • Powered by Mercado Pago",
        40,
        doc.y,
        {
          width: doc.page.width - 80,
          align: "center"
        }
      );

    doc.end();

  });

};
