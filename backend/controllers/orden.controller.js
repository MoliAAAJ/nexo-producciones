"use strict";

import Evento from "../models/Evento.js";
import Orden from "../models/Orden.js";
import Ticket from "../models/Ticket.js";

import { generarPDF } from "../utils/generarPDF.js";
import { preferenceClient } from "../config/mp.js";

/**
 * 🧾 CREAR ORDEN (BLINDADO)
 */
export const crearOrden = async (req, res) => {

  try {

    const { evento_id, items, cliente } = req.body;

    if (!evento_id || !items?.length) {
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

      entrada.stock -= item.cantidad;
    }

    await evento.save();

    const orden = await Orden.create({
      evento_id,
      cliente,
      items: itemsFinal,
      total,
      estado: "pendiente"
    });

    /**
     * 🚨 FIX CRÍTICO: URL ABSOLUTA SEGURA
     */
    const FRONT =
      process.env.FRONT_URL ||
      "http://localhost:3000";

    const BACK =
      process.env.BASE_URL ||
      "http://localhost:3000";

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

        notification_url: `${BACK}/mp/webhook`,

        back_urls: {
          success: `${FRONT}/pages/success.html?orden_id=${orden._id}`,
          failure: `${FRONT}/payments/fail.html`,
          pending: `${FRONT}/payments/pending.html`
        },

        auto_return: "approved",

        external_reference: String(orden._id)
      }
    });

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

    console.error("❌ Error creando orden:", error);

    return res.status(500).json({
      error: "Error al procesar compra"
    });
  }
};

/**
 * 🔍 OBTENER ORDEN
 */
export const obtenerOrden = async (req, res) => {

  try {

    const orden = await Orden.findById(req.params.id)
      .populate("evento_id");

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
 * 📄 PDF
 */
export const descargarTicketPDF = async (req, res) => {

  try {

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        error: "Ticket no encontrado"
      });
    }

    const orden = await Orden.findById(ticket.orden_id)
      .populate("evento_id");

    const pdfBuffer = await generarPDF(ticket, orden);

    res.setHeader("Content-Type", "application/pdf");
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
