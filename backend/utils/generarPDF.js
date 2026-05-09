import PDFDocument from "pdfkit";

export const generarPDF = (ticket, orden) => {

  return new Promise((resolve, reject) => {

    const doc = new PDFDocument({
      size: "A4",
      margin: 50
    });

    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));

    doc.on("end", () => {

      const pdfData = Buffer.concat(buffers);

      resolve(pdfData);

    });

    // 🎨 HEADER

    doc
      .fontSize(28)
      .fillColor("#111")
      .text("NEXO TICKETS", {
        align: "center"
      });

    doc.moveDown();

    doc
      .fontSize(18)
      .fillColor("#00aa55")
      .text("Entrada válida", {
        align: "center"
      });

    doc.moveDown(2);

    // 📋 INFO

    doc
      .fontSize(14)
      .fillColor("#000");

    doc.text(`Ticket ID: ${ticket._id}`);
    doc.moveDown();

    doc.text(`Orden ID: ${orden._id}`);
    doc.moveDown();

    doc.text(
      `Cliente: ${orden.cliente.nombre} ${orden.cliente.apellido}`
    );

    doc.moveDown();

    doc.text(`Tipo entrada: ${ticket.tipo}`);

    doc.moveDown();

    doc.text(`Estado: ${orden.estado}`);

    doc.moveDown(2);

    // 🧾 QR

    doc
      .fontSize(16)
      .text("Código QR", {
        align: "center"
      });

    doc.moveDown();

    // 👉 ticket.qr_code es base64

    const base64Data = ticket.qr_code.replace(
      /^data:image\/png;base64,/,
      ""
    );

    const qrBuffer = Buffer.from(base64Data, "base64");

    doc.image(qrBuffer, {
      fit: [220, 220],
      align: "center"
    });

    doc.moveDown(2);

    // 🦶 FOOTER

    doc
      .fontSize(12)
      .fillColor("gray")
      .text(
        "Presentar este ticket al ingresar al evento",
        {
          align: "center"
        }
      );

    doc.end();

  });

};
