import nodemailer from "nodemailer";

export const enviarTicketsEmail = async ({
  cliente,
  evento,
  tickets
}) => {

  try {

    console.log("📧 Iniciando envío de email...");

    const transporter = nodemailer.createTransport({

      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }

    });

    // ✅ verificar conexión gmail

    await transporter.verify();

    console.log("✅ Gmail conectado");

    const attachments = tickets.map(ticket => ({

      filename: `ticket-${ticket._id}.pdf`,

      href:
  `     ${process.env.BASE_URL}/api/orden/ticket/${ticket._id}/pdf`

    }));

    console.log("📎 Adjuntos:", attachments.length);

    const info = await transporter.sendMail({

      from: `"NEXO Tickets" <${process.env.EMAIL_USER}>`,

      to: cliente.email,

      subject: `Tus entradas para ${evento.nombre}`,

      html: `

        <div style="
          font-family:Arial;
          padding:20px;
        ">

          <h1 style="color:#7c3aed;">
            🎟️ Compra confirmada
          </h1>

          <p>
            Hola ${cliente.nombre},
          </p>

          <p>
            Tus entradas para
            <strong>${evento.nombre}</strong>
            fueron generadas correctamente.
          </p>

          <p>
            Encontrarás los tickets adjuntos en PDF.
          </p>

          <p>
            ¡Gracias por comprar con NEXO!
          </p>

        </div>

      `,

      attachments

    });

    console.log("✅ MAIL ENVIADO");
    console.log(info);

  } catch (error) {

    console.error(
      "❌ ERROR ENVIANDO MAIL:"
    );

    console.error(error);

  }

};
