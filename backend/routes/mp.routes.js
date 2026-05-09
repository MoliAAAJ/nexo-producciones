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

    // 🔥 CONSULTAR PAGO REAL EN MP

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

    if (orden.estado === "pagado") {

      console.log("⚠️ Orden ya pagada");

      return res.sendStatus(200);

    }

    // ✅ MARCAR PAGADA

    orden.estado = "pagado";

    await orden.save();

    // 🎟️ GENERAR TICKETS

    const tickets = [];

    for (const item of orden.items) {

      const evento = orden.evento_id;

      for (let i = 0; i < item.cantidad; i++) {

        tickets.push({
          orden_id: orden._id,
          evento_id: evento._id,
          tipo: item.tipo,
          qr_code: generarQR(),
          usado: false
        });

      }

    }

    await Ticket.insertMany(tickets);

    console.log("🎟️ Tickets generados correctamente");

    return res.sendStatus(200);

  } catch (error) {

    console.error("❌ ERROR WEBHOOK:", error);

    return res.sendStatus(500);

  }

});

export default router;
