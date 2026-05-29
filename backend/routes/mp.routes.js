"use strict";

import express from "express";
import mongoose from "mongoose";

import {
  MercadoPagoConfig,
  Payment
} from "mercadopago";

import Evento from "../models/Evento.js";
import Orden from "../models/Orden.js";
import Ticket from "../models/Ticket.js";

import { generarQR } from "../utils/generarQR.js";
import { enviarTicketsEmail } from "../utils/enviarTicketsEmail.js";

const router = express.Router();

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

const paymentClient = new Payment(client);

/**
 * 🔥 WEBHOOK MERCADOPAGO
 */
router.post("/webhook", async (req, res) => {

  try {

    console.log("🔥 WEBHOOK RECIBIDO");
    console.log(req.body);

    const type = req.body?.type || req.body?.topic;

    let paymentId = null;

    /**
     * 💳 CASO 1: PAYMENT DIRECTO
     */
    if (type === "payment") {
      paymentId =
        req.body?.data?.id ||
        req.query["data.id"];
    }

    /**
     * 🧾 CASO 2: MERCHANT ORDER
     */
    if (type === "merchant_order") {

      const url = req.body?.resource;

      if (!url) {
        console.log("❌ merchant_order sin resource");
        return res.sendStatus(200);
      }

      console.log("🧾 Merchant Order URL:", url);

      const response = await fetch(url);
      const merchantOrder = await response.json();

      const payment = merchantOrder.payments?.find(
        p => p.status === "approved"
      );

      if (!payment) {
        console.log("⚠ sin payment aprobado en merchant_order");
        return res.sendStatus(200);
      }

      paymentId = payment.id;
    }

    /**
     * ❌ SIN PAYMENT
     */
    if (!paymentId) {
      console.log("❌ paymentId missing");
      return res.sendStatus(200);
    }

    /**
     * 💳 OBTENER PAYMENT REAL
     */
    const payment = await paymentClient.get({
      id: paymentId
    });

    const paymentData = payment.body || payment;

    console.log("💳 PAYMENT:", paymentData);

    const orderId = paymentData.external_reference;

    if (!orderId) {
      console.log("❌ external_reference missing");
      return res.sendStatus(200);
    }

    // Intentamos buscar si ya existe una orden que procesó este pago exacto
    const ordenExistente = await Orden.findOne({ mp_payment_id: paymentId });
    if (ordenExistente) {
      console.log("⚠ Este pago ya fue procesado anteriormente");
      return res.sendStatus(200);
    }

    /**
     * 📦 OBTENER ORDEN ORIGINAL
     */
    const orden = await Orden.findById(orderId).populate("evento_id");

    if (!orden) {
      console.log("❌ Orden no encontrada");
      return res.sendStatus(200);
    }

    /**
     * 🚫 DUPLICADO
     */
    if (orden.estado === "pagado" || orden.mp_status === "approved") {
      console.log("⚠ Orden ya pagada");
      return res.sendStatus(200);
    }

    /**
     * ❌ NO APROBADO
     */
    if (paymentData.status !== "approved") {
      console.log("⚠ Pago no aprobado");
      return res.sendStatus(200);
    }

    /**
     * 📉 DESCONTAR STOCK
     */
    const eventoId =
      typeof orden.evento_id === "string"
        ? orden.evento_id
        : orden.evento_id?._id;

    const evento = await Evento.findById(eventoId);

    if (!evento) {
      console.log("❌ Evento no encontrado para descontar stock");
      return res.sendStatus(200);
    }

    for (const item of orden.items) {
      const tipo = String(item.tipo || "")
        .trim()
        .toLowerCase();

      const entrada = evento.entradas.find(
        e => e.tipo.trim().toLowerCase() === tipo
      );

      if (!entrada) {
        console.log(`❌ Entrada no encontrada: ${item.tipo}`);
        return res.sendStatus(500);
      }

      const cantidad = Number(item.cantidad || 1);

      if (Number(entrada.stock || 0) < cantidad) {
        console.log(`❌ Stock insuficiente para ${item.tipo}`);
        return res.sendStatus(500);
      }

      entrada.stock -= cantidad;
    }

    await evento.save();

    /**
     * ✅ ACTUALIZAR ORDEN (Con info de pago)
     */
    orden.estado = "pagado";
    orden.mp_payment_id = paymentId;
    orden.mp_status = paymentData.status;
    await orden.save();

    /**
     * 🎟️ GENERAR TICKETS
     */
    const ticketsParaInsertar = [];

    for (const item of orden.items) {
      for (let i = 0; i < item.cantidad; i++) {
        ticketsParaInsertar.push({
          orden_id: orden._id,
          evento_id: evento._id,
          tipo: item.tipo,
          usado: false
        });
      }
    }

    // Generamos los IDs y QRs antes de insertar
    for (const t of ticketsParaInsertar) {
      const tempId = new mongoose.Types.ObjectId();
      t._id = tempId;
      t.qr_code = await generarQR(tempId);
    }

    const ticketsGenerados = await Ticket.insertMany(ticketsParaInsertar);
    console.log("🎟️ Tickets generados correctamente");

    /**
     * 📧 EMAIL (async safe)
     */
    enviarTicketsEmail({
      cliente: orden.cliente,
      evento: orden.evento_id,
      tickets: ticketsGenerados
    }).catch(err =>
      console.error("❌ Error mail:", err)
    );

    console.log("📧 Email enviado");

    return res.sendStatus(200);

  } catch (error) {

    console.error("❌ ERROR WEBHOOK:", error);

    return res.sendStatus(500);
  }
});

export default router;
