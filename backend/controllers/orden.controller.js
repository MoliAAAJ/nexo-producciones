import Evento from "../models/Evento.js";
import Orden from "../models/Orden.js";
import Ticket from "../models/Ticket.js";

import { generarQR } from "../utils/generarQR.js";
import { generarPDF } from "../utils/generarPDF.js";

import { preferenceClient } from "../config/mp.js";

/**
 * 🧾 CREAR ORDEN + LINK DE PAGO
 */
export const crearOrden = async (req, res) => {

  try {

    const { evento_id, items, cliente } = req.body;

    // 🔒 Validaciones básicas

    if (!evento_id || !items || items.length === 0) {

      return res.status(400).json({
        error: "Datos incompletos"
      });

    }

    const evento = await Evento.findById(evento_id);

    if (!evento) {

      return res.status(404).json({
        error: "Evento no encontrado"
      });

    }

    let total = 0;

    const itemsFinal = [];

    // 🔁 Validar entradas

    for (const item of items) {

      const entrada = evento.entradas.find(
        e => e.tipo === item.tipo
      );

      if (!entrada) {

        return res.status(400).json({
          error: "Entrada inválida"
        });

      }

      if (entrada.stock < item.cantidad) {

        return res.status(400).json({
          error: "Stock insuficiente"
        });

      }

      total += entrada.precio * item.cantidad;

      itemsFinal.push({
        tipo: entrada.tipo,
        cantidad: item.cantidad,
        precio_unitario: entrada.precio
      });

      // 🔥 descontar stock

      entrada.stock -= item.cantidad;

    }

    await evento.save();

    // 🧾 Crear orden

    const orden = await Orden.create({

      evento_id,

      cliente,

      items: itemsFinal,

      total,

      estado: "pendiente"

    });

    // 💳 Crear preferencia MercadoPago

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

        // 🔥 Webhook MP

        notification_url:
          `${process.env.BASE_URL}/mp/webhook`,

        // 🔥 URLs frontend

        back_urls: {

          success:
            `${process.env.FRONT_URL}/success.html?orden_id=${orden._id}`,

          failure:
            `${process.env.FRONT_URL}/fail.html`,

          pending:
            `${process.env.FRONT_URL}/pending.html`

        },

        // 🔥 Referencia interna

        external_reference: String(orden._id)

      }

    });

    // 🔗 Link checkout

    const init_point =
      preference.init_point ||
      preference.body?.init_point;

    return res.json({

      ok: true,

      orden_id: orden._id,

      total,

      init_point

    });

  } catch (error) {

    console.error(
      "❌ Error al crear orden:",
      error
    );

    return res.status(500).json({
      error: "Error al procesar compra"
    });

  }

};


/**
 * 🎟️ WEBHOOK MERCADOPAGO
 */
export const mpWebhook = async (req, res) => {

  try {

    console.log("🔥 WEBHOOK RECIBIDO");

    const paymentId =
      req.query["data.id"] ||
      req.body?.data?.id;

    if (!paymentId) {

      console.log("❌ paymentId no encontrado");

      return res.sendStatus(200);

    }

    // 🔥 Consultar pago real en MP

    const response = await fetch(

      `https://api.mercadopago.com/v1/payments/${paymentId}`,

      {
        headers: {
          Authorization:
            `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
        }
      }

    );

    const payment = await response.json();

    console.log("💳 PAYMENT:", payment);

    const ordenId = payment.external_reference;

    if (!ordenId) {

      console.log("❌ external_reference no encontrada");

      return res.sendStatus(200);

    }

    const orden = await Orden.findById(ordenId);

    if (!orden) {

      console.log("❌ Orden no encontrada");

      return res.sendStatus(200);

    }

    // ⚠️ evitar duplicados

    if (orden.estado === "pagado") {

      console.log("⚠️ Orden ya pagada");

      return res.sendStatus(200);

    }

    // ✅ marcar pagada

    orden.estado = "pagado";

    await orden.save();

    // 🎟️ generar tickets

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

    console.log(
      "🎟️ Tickets generados correctamente"
    );

    return res.sendStatus(200);

  } catch (error) {

    console.error(
      "❌ Error webhook:",
      error
    );

    return res.sendStatus(500);

  }

};


/**
 * 🔍 OBTENER ORDEN + TICKETS
 */
export const obtenerOrden = async (req, res) => {

  try {

    const orden = await Orden.findById(
      req.params.id
    );

    if (!orden) {

      return res.status(404).json({
        error: "Orden no encontrada"
      });

    }

    const tickets = await Ticket.find({
      orden_id: orden._id
    });

    return res.json({

      ok: true,

      orden,

      tickets

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Error obteniendo orden"
    });

  }

};


/**
 * 📄 DESCARGAR PDF
 */
export const descargarTicketPDF = async (req, res) => {

  try {

    const ticket = await Ticket.findById(
      req.params.id
    );

    if (!ticket) {

      return res.status(404).json({
        error: "Ticket no encontrado"
      });

    }

    const orden = await Orden.findById(
      ticket.orden_id
    );

    const pdfBuffer = await generarPDF(
      ticket,
      orden
    );

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=ticket-${ticket._id}.pdf`
    );

    return res.send(pdfBuffer);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Error generando PDF"
    });

  }

};
