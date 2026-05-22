"use strict";

import Evento from "../models/Evento.js";
import Orden from "../models/Orden.js";
import Ticket from "../models/Ticket.js";

import { generarPDF } from "../utils/generarPDF.js";
import { preferenceClient } from "../config/mp.js";

/**
 * 🧾 CREAR ORDEN
 */
export const crearOrden = async (req, res) => {
  try {
    const {
      evento_id,
      items,
      cliente,
      codigo_descuento
    } = req.body;

    console.log("📦 BODY:", req.body);

    if (!evento_id || !items?.length) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const evento = await Evento.findById(evento_id);

    if (!evento) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    /**
     * 🚨 BLOQUEO EVENTO
     */
    if (evento.estado !== "activo") {
      return res.status(400).json({
        error: "Este evento no permite compras online"
      });
    }

    let total = 0;
    const itemsFinal = [];

    /**
     * VALIDACIÓN DE ENTRADAS Y STOCK
     */
    for (const item of items) {
      const cantidadNum = Number(item.cantidad || 1);

      const tipo = String(item.tipo || "").trim().toLowerCase();

      const entrada = evento.entradas.find(
        (e) => e.tipo.trim().toLowerCase() === tipo
      );

      if (!entrada) {
        return res.status(400).json({ error: "Entrada inválida" });
      }

      if (Number.isNaN(cantidadNum) || cantidadNum <= 0) {
        return res.status(400).json({ error: "Cantidad inválida" });
      }

      const stockDisponible = Number(entrada.stock || 0);

      if (stockDisponible < cantidadNum) {
        return res.status(400).json({ error: "Stock insuficiente" });
      }

      total += Number(entrada.precio) * cantidadNum;

      itemsFinal.push({
        tipo: entrada.tipo,
        cantidad: cantidadNum,
        precio_unitario: Number(entrada.precio)
      });
    }

    /**
     * 💰 DESCUENTO BACKEND
     */
    let descuento = 0;

    if ((codigo_descuento || "").trim().toUpperCase() === "NEXO10") {
      descuento = total * 0.10;
    }

    /**
     * 🔥 TOTAL FINAL REAL
     */
    const totalFinal = Math.round((total - descuento) * 100) / 100;

    console.log("TOTAL BASE:", total);
    console.log("DESCUENTO:", descuento);
    console.log("TOTAL FINAL:", totalFinal);

    /**
     * 🧾 ORDEN
     */
    const orden = await Orden.create({
      evento_id,
      cliente,
      items: itemsFinal,
      total: totalFinal,
      descuento,
      codigo_descuento: codigo_descuento || null,
      estado: "pendiente"
    });

    /**
     * 🌐 URLS
     */
    const FRONT = process.env.FRONT_URL || "http://localhost:3000";
    const BACK = process.env.BASE_URL || "http://localhost:3000";

    /**
     * 💳 MERCADOPAGO
     *
     * 👉 SOLO 1 ITEM CON TOTAL FINAL
     */
    const preference = await preferenceClient.create({
      body: {
        items: [
          {
            title: `Entrada ${evento.nombre}`,
            quantity: 1,
            unit_price: totalFinal,
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
        external_reference: orden._id.toString()
      }
    });

    const init_point =
      preference.init_point ||
      preference.response?.init_point ||
      preference.body?.init_point;

    console.log("🔥 INIT POINT:", init_point);

    if (!init_point) {
      return res.status(500).json({
        error: "MercadoPago no devolvió init_point"
      });
    }

    return res.json({
      ok: true,
      orden_id: orden._id,
      total: totalFinal,
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
