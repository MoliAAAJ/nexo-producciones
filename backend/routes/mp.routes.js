import express from "express";

import { MercadoPagoConfig, Payment } from "mercadopago";

import Orden from "../models/Orden.js";
import Ticket from "../models/Ticket.js";

import { generarQR } from "../utils/generarQR.js";

const router = express.Router();

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

const paymentClient = new Payment(client);

router.post("/webhook", async (req, res) => {

  try {

    console.log("🔥 WEBHOOK RECIBIDO");

    const paymentId = req.body.data?.id;

    if (!paymentId) {

      return res.sendStatus(200);

    }

    // 🔥 CONSULTAR PAGO REAL

    const payment = await paymentClient.get({
      id: paymentId
    });

    console.log("💳 PAYMENT:", payment);

    const orderId = payment.external_reference;

    if (!orderId) {

      console.log("❌ external_reference no encontrada");

      return res.sendStatus(200);

    }

    const orden = await Orden
      .findById(orderId)
      .populate("evento_id");

    if (!orden) {

      console.log("❌ Orden no encontrada");

      return res.sendStatus(200);

    }

    // evitar duplicados

    if (orden.estado === "pagado") {

      console.log("⚠ Orden ya pagada");

      return res.sendStatus(200);

    }

    // validar estado MP

    if (payment.status !== "approved") {

      console.log("⚠ Pago no aprobado");

      return res.sendStatus(200);

    }

    // ✅ MARCAR PAGADA

    orden.estado = "pagado";

    await orden.save();

    // 🎟️ GENERAR TICKETS

    for (const item of orden.items) {

      const evento = orden.evento_id;

      for (let i = 0; i < item.cantidad; i++) {

        // crear ticket

        const ticket = new Ticket({

          orden_id: orden._id,

          evento_id: evento._id,

          tipo: item.tipo,

          usado: false

        });

        // generar QR usando ticket._id

        ticket.qr_code = await generarQR(ticket._id);

        // guardar ticket

        await ticket.save();

      }

    }

    console.log("🎟️ Tickets generados correctamente");

    return res.sendStatus(200);

  } catch (error) {

    console.error("❌ ERROR WEBHOOK:", error);

    return res.sendStatus(500);

  }

});

export default router;
