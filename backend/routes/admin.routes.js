import express from "express";
import Orden from "../models/Orden.js";
import Ticket from "../models/Ticket.js";
import Evento from "../models/Evento.js";
import { isAdmin } from "../middleware/auth.js";

const router = express.Router();

/**
 * 🔐 PROTECCIÓN DE RUTAS
 */
router.use(isAdmin);

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
      {
        $match: {
          estado: "pagado"
        }
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$total"
          }
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

    if (usados === "true") {
      filter.usado = true;
    }

    if (usados === "false") {
      filter.usado = false;
    }

    const tickets = await Ticket.find(filter)
      .populate(
        "evento_id",
        "titulo fecha lugar"
      )
      .populate(
        "orden_id",
        "cliente total estado"
      )
      .sort({
        createdAt: -1
      });

    res.json({
      ok: true,
      tickets
    });

  } catch (err) {

    console.error(err);

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
    const data = await Evento.aggregate([
      {
        $lookup: {
          from: "ordenes",
          localField: "_id",
          foreignField: "evento_id",
          as: "ventas_info"
        }
      },
      {
        $lookup: {
          from: "tickets",
          localField: "_id",
          foreignField: "evento_id",
          as: "tickets_info"
        }
      },
      {
        $project: {
          evento: "$$ROOT",
          ventas: {
            $size: {
              $filter: {
                input: "$ventas_info",
                as: "v",
                cond: { $eq: ["$$v.estado", "pagado"] }
              }
            }
          },
          tickets: { $size: "$tickets_info" },
          usados: {
            $size: {
              $filter: {
                input: "$tickets_info",
                as: "t",
                cond: { $eq: ["$$t.usado", true] }
              }
            }
          }
        }
      }
    ]);

    res.json({
      ok: true,
      data
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      ok: false,
      error: "Error eventos"
    });

  }

});

export default router;
