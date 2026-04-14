import express from "express";
import Orden from "../models/Orden.js";
import Ticket from "../models/Ticket.js";
import Evento from "../models/Evento.js";
import { generarQR } from "../utils/generarQR.js";

const router = express.Router();

router.post("/webhook", async (req, res) => {
  try {
    const payment = req.body;

    if (payment.type !== "payment") return res.sendStatus(200);

    const orderId = payment.data?.external_reference;

    const orden = await Orden.findById(orderId).populate("evento_id");

    if (!orden) return res.sendStatus(200);

    if (orden.estado === "pagado") return res.sendStatus(200);

    orden.estado = "pagado";
    await orden.save();

    const tickets = [];

    for (const item of orden.items) {
      const evento = orden.evento_id;

      for (let i = 0; i < item.cantidad; i++) {
        tickets.push({
          orden_id: orden._id,
          evento_id: evento._id,
          tipo: item.tipo,
          qr_code: generarQR()
        });
      }
    }

    await Ticket.insertMany(tickets);

    console.log("🎟️ Tickets generados por pago confirmado");

    res.sendStatus(200);

  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

export default router;
