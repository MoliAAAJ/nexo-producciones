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

    /**
     * ✅ Verificar Gmail
     */
    await transporter.verify();

    console.log("✅ Gmail conectado");

    /**
     * 🔥 SOLO 1 PDF
     */
    const ticketPrincipal = tickets[0];

    const attachments = [
      {
        filename: `NEXO-${ticketPrincipal._id
          .toString()
          .slice(-5)}.pdf`,

        href:
          `${process.env.BASE_URL}/api/orden/ticket/${ticketPrincipal._id}/pdf`
      }
    ];

    console.log("📎 Adjuntos:", attachments.length);

    /**
     * 📧 EMAIL
     */
    const info = await transporter.sendMail({

      from: `"NEXO Tickets" <${process.env.EMAIL_USER}>`,

      to: cliente.email,

      subject: `Tus entradas para ${evento.nombre}`,

      html: `

        <div style="
          font-family: Arial;
          background: #0f0f12;
          color: white;
          padding: 40px;
          border-radius: 20px;
        ">

          <div style="text-align:center;">

            <h1 style="
              color:#a855f7;
              margin-bottom:10px;
            ">
              🎟️ Compra confirmada
            </h1>

            <p style="
              color:#9ca3af;
              font-size:16px;
            ">
              Tus entradas ya están listas
            </p>

          </div>

          <div style="
            margin-top:35px;
            background:#18181b;
            border-radius:18px;
            padding:25px;
          ">

            <p>
              Hola <strong>${cliente.nombre}</strong>,
            </p>

            <p>
              Gracias por comprar entradas para:
            </p>

            <h2 style="
              color:#22c55e;
              margin-top:15px;
            ">
              ${evento.nombre}
            </h2>

            <p style="
              margin-top:20px;
              color:#d1d5db;
            ">
              Encontrarás tu ticket digital adjunto en PDF.
            </p>

            <p style="
              color:#9ca3af;
              margin-top:20px;
              font-size:14px;
            ">
              Presentalo desde tu celular o impreso al ingresar.
            </p>

          </div>

          <div style="
            margin-top:30px;
            text-align:center;
            color:#6b7280;
            font-size:13px;
          ">
            NEXO Tickets • Powered by Mercado Pago
          </div>

        </div>

      `,

      attachments

    });

    console.log("✅ MAIL ENVIADO");
    console.log(info);

  } catch (error) {

    console.error("❌ ERROR ENVIANDO MAIL:");
    console.error(error);

  }

};
