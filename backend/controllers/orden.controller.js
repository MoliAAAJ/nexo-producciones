import Evento from "../models/Evento.js";
import Orden from "../models/Orden.js";
import Ticket from "../models/Ticket.js";
import { generarQR } from "../utils/generarQR.js";
import { preferenceClient } from "../config/mp.js";

/**
 * 🧾 CREAR ORDEN + LINK DE PAGO (MercadoPago)
 */
export const crearOrden = async (req, res) => {
  try {
    const { evento_id, items, cliente } = req.body;

    // 🔒 validación básica
    if (!evento_id || !items || items.length === 0) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const evento = await Evento.findById(evento_id);

    if (!evento) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    let total = 0;
    const itemsFinal = [];

    // 🔁 validar entradas
    for (const item of items) {
      const entrada = evento.entradas.find(e => e.tipo === item.tipo);

      if (!entrada) {
        return res.status(400).json({ error: "Entrada inválida" });
      }

      if (entrada.stock < item.cantidad) {
        return res.status(400).json({ error: "Stock insuficiente" });
      }

      total += entrada.precio * item.cantidad;

      itemsFinal.push({
        tipo: entrada.tipo,
        cantidad: item.cantidad,
        precio_unitario: entrada.precio
      });

      // descontar stock
      entrada.stock -= item.cantidad;
    }

    await evento.save();

    // 🧾 crear orden
    const orden = await Orden.create({
      evento_id,
      cliente,
      items: itemsFinal,
      total,
      estado: "pendiente"
    });

    // 💳 crear preferencia MercadoPago
    const preference = await preferenceClient.create({
      body: {
        items: [
          {
            title: `Entrada ${evento.nombre}`,
            quantity: 1,
            unit_price: total,
            currency_id: "ARS"
          }
        ],

      back_urls: {
        success: `${process.env.FRONT_URL}/success.html`,
        failure: `${process.env.FRONT_URL}/fail.html`,
        pending: `${process.env.FRONT_URL}/pending.html`
      },

      external_reference: String(orden._id)
      }
    });

    // 🔗 init point seguro
    const init_point = preference.init_point;

    return res.json({
      ok: true,
      orden_id: orden._id,
      total,
      init_point
    });

  } catch (error) {
    console.error("❌ Error al crear orden:", error);
    return res.status(500).json({ error: "Error al procesar compra" });
  }
};


/**
 * 🎟️ WEBHOOK MERCADOPAGO
 * 👉 genera tickets cuando se confirma pago
 */
export const mpWebhook = async (req, res) => {
  try {
    const paymentId = req.query["data.id"] || req.body?.data?.id;

    if (!paymentId) {
      return res.sendStatus(200);
    }

    const ordenId = req.body?.data?.external_reference;

    if (!ordenId) {
      return res.sendStatus(200);
    }

    const orden = await Orden.findById(ordenId);

    if (!orden) {
      return res.sendStatus(200);
    }

    if (orden.estado === "pagado") {
      return res.sendStatus(200);
    }

    orden.estado = "pagado";
    await orden.save();

    const tickets = [];

    for (const item of orden.items) {
      for (let i = 0; i < item.cantidad; i++) {
        tickets.push({
          orden_id: orden._id,
          evento_id: orden.evento_id,
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
    console.error("❌ Error webhook:", error);
    return res.sendStatus(200);
  }
};
