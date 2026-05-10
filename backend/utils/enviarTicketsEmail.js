import nodemailer from "nodemailer";

export const enviarTicketsEmail = async ({
  cliente,
  evento,
  tickets
}) => {

  try {

    const transporter =
      nodemailer.createTransport({

        service: "gmail",

        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }

      });

    // 📎 PDFs adjuntos
    const attachments =
      tickets.map(ticket => ({

        filename:
          `ticket-${ticket._id}.pdf`,

        path:
          `${process.env.BASE_URL}/api/ticket/${ticket._id}/pdf`

      }));

    await transporter.sendMail({

      from:
        `"NEXO Tickets" <${process.env.EMAIL_USER}>`,

      to:
        cliente.email,

      subject:
        `Tus entradas para ${evento.nombre}`,

      html: `

        <div style="
          font-family:Arial;
          padding:20px;
          background:#111;
          color:white;
        ">

          <h1 style="
            color:#7c3aed;
          ">
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
            Gracias por comprar con NEXO.
          </p>

        </div>

      `,

      // 🔥 ACÁ ESTABA EL BUG
      attachments

    });

    console.log(
      "📧 Mail enviado correctamente"
    );

  } catch (error) {

    console.error(
      "❌ ERROR ENVIANDO MAIL:"
    );

    console.log(error);

  }

};
