import express from "express";
import Orden from "../models/Orden.js";
import Ticket from "../models/Ticket.js";
import Evento from "../models/Evento.js";

const router = express.Router();

/**
 * VARIABLES DE ENTORNO
 */
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;

/**
 * AUTH BASIC
 */
function isAuthorized(req) {

  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Basic ")) {
    return false;
  }

  try {

    const base64 = authHeader.replace("Basic ", "");

    const decoded = Buffer
      .from(base64, "base64")
      .toString("utf8");

    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) {
      return false;
    }

    const user = decoded.substring(0, separatorIndex);
    const pass = decoded.substring(separatorIndex + 1);

    return (
      user === ADMIN_USER &&
      pass === ADMIN_PASS
    );

  } catch (err) {

    return false;

  }

}

/**
 * MIDDLEWARE ADMIN
 */
router.use((req, res, next) => {

  if (isAuthorized(req)) {
    return next();
  }

  return res.status(401).json({
    ok: false,
    error: "No autorizado"
  });

});

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

    const eventos = await Evento.find();

    const data = await Promise.all(

      eventos.map(async (evento) => {

        const ventas = await Orden.countDocuments({
          evento_id: evento._id,
          estado: "pagado"
        });

        const tickets = await Ticket.countDocuments({
          evento_id: evento._id
        });

        const usados = await Ticket.countDocuments({
          evento_id: evento._id,
          usado: true
        });

        return {
          evento,
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

    console.error(err);

    res.status(500).json({
      ok: false,
      error: "Error eventos"
    });

  }

});

export default router;
