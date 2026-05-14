import path from "path";
import PDFDocument from "pdfkit";

export const generarPDF = (ticket, orden) => {

  return new Promise((resolve, reject) => {

    const doc = new PDFDocument({
      size: "A4",
      margin: 50
    });

    // 🖼️ LOGO
    const logoPath = path.resolve(
      "assets/logo.png"
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

    // 🔥 LOGO

    try {

      doc.image(logoPath, {
        fit: [140, 140],
        align: "center"
      });

    } catch (error) {

      console.log(
        "⚠️ Logo no encontrado"
      );

    }

    doc.moveDown(1);

    // 🎵 EVENTO

    const nombreEvento =
      orden.evento_id?.nombre ||
      "EVENTO";

    doc
      .fontSize(22)
      .fillColor("#111")
      .text(
        nombreEvento,
        {
          align: "center"
        }
      );

    doc.moveDown(1);

    // 👤 CLIENTE

    doc
      .fontSize(14)
      .fillColor("#000");

    doc.text(
      `Cliente: ${orden.cliente.nombre} ${orden.cliente.apellido}`
    );

    doc.moveDown();

    // 🎟️ TIPO

    doc.text(
      `Tipo entrada: ${ticket.tipo}`
    );

    doc.moveDown();

    // 📍 LUGAR

    doc.text(
      `Lugar: ${
        orden.evento_id?.lugar ||
        "Lugar a confirmar"
      }`
    );

    doc.moveDown();

    // 📅 FECHA EVENTO

    const fechaEvento =
      orden.evento_id?.fecha
        ? new Date(
            orden.evento_id.fecha
          ).toLocaleDateString("es-AR")
        : "Fecha a confirmar";

    doc.text(
      `Fecha: ${fechaEvento}`
    );

    doc.moveDown();

    // 🕒 HORA EVENTO

    doc.text(
      `Hora: ${
        orden.evento_id?.hora ||
        "Horario a confirmar"
      }`
    );

    doc.moveDown(1);

    // 🎟️ TEXTO QR

    doc
      .fontSize(16)
      .fillColor("#111")
      .text(
        "Escaneá en puerta",
        {
          align: "center"
        }
      );

    doc.moveDown();

    // 🔥 QR CENTRADO

    const qrSize = 170;

    const pageWidth =
      doc.page.width;

    const x =
      (pageWidth - qrSize) / 2;

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

    doc.moveDown(12);

    // 🔑 CÓDIGO

    doc
      .fontSize(16)
      .fillColor("#7c3aed")
      .text(

        `Código: NEXO-${ticket._id
          .toString()
          .slice(-5)}`,

        {
          align: "center"
        }

      );

    doc.moveDown(1);

    // 🦶 FOOTER

    doc
      .fontSize(11)
      .fillColor("gray")
      .text(
        "Presentar este ticket al ingresar al evento",
        {
          align: "center"
        }
      );

    doc.moveDown();

    doc
      .fontSize(10)
      .fillColor("#999")
      .text(
        "NEXO Tickets • Powered by MercadoPago",
        {
          align: "center"
        }
      );

    doc.end();

  });

};
