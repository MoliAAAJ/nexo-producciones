import express from "express";
import Orden from "../models/Orden.js";
import Ticket from "../models/Ticket.js";
import Evento from "../models/Evento.js";

const router = express.Router();

/**
 * 📊 DASHBOARD GENERAL
 */
router.get("/dashboard", async (req, res) => {

  try {

    const totalOrdenes = await Orden.countDocuments();

    const ticketsTotal = await Ticket.countDocuments();

    const ticketsUsados = await Ticket.countDocuments({
      usado: true
    });

    const ingresos = await Orden.aggregate([
      { $match: { estado: "pagado" } },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" }
        }
      }
    ]);

    res.json({
      ok: true,
      data: {
        totalOrdenes,
        ticketsTotal,
        ticketsUsados,
        ingresos: ingresos[0]?.total || 0
      }
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      ok: false,
      error: "Error dashboard"
    });

  }

});

/**
 * 🎟 TICKETS CON FILTRO
 */
router.get("/tickets", async (req, res) => {

  try {

    const { usados } = req.query;

    const filter = {};

    if (usados === "true") filter.usado = true;
    if (usados === "false") filter.usado = false;

    const tickets = await Ticket
      .find(filter)
      .populate("evento_id")
      .populate("orden_id")
      .sort({ createdAt: -1 });

    res.json({
      ok: true,
      tickets
    });

  } catch (err) {

    res.status(500).json({
      ok: false,
      error: "Error tickets"
    });

  }

});

/**
 * 🎫 EVENTOS CON ESTADÍSTICAS
 */
router.get("/eventos", async (req, res) => {

  try {

    const eventos = await Evento.find();

    const data = await Promise.all(
      eventos.map(async (e) => {

        const ventas = await Orden.countDocuments({
          evento_id: e._id,
          estado: "pagado"
        });

        const tickets = await Ticket.countDocuments({
          evento_id: e._id
        });

        const usados = await Ticket.countDocuments({
          evento_id: e._id,
          usado: true
        });

        return {
          evento: e,
          ventas,
          tickets,
          usados
        };

      })
    );

    res.json({
      ok: true,
      data
    });

  } catch (err) {

    res.status(500).json({
      ok: false,
      error: "Error eventos"
    });

  }

});

export default router;
