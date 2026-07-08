import express from "express";

import Ticket from "../models/Ticket.js";

import {
  descargarTicketPDF
} from "../controllers/orden.controller.js";
import { buildTicketValidationPayload } from "../utils/ticketValidation.js";

const router = express.Router();

/**
 * 🎟️ VALIDAR TICKET
 */
router.post("/validar", async (req, res) => {

  try {

    const { ticketId } = req.body;

    const ticket =
      await Ticket.findById(ticketId)
        .populate("orden_id")
        .populate("evento_id");

    if (!ticket) {

      return res.json({

        ok: false,

        message:
          "Ticket inválido"

      });

    }

    if (ticket.usado) {

      return res.json({

        ok: false,

        message:
          "Ticket ya utilizado"

      });

    }

    ticket.usado = true;

    await ticket.save();

    return res.json(buildTicketValidationPayload(ticket));

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      ok: false,

      message:
        "Error servidor"

    });

  }

});


/**
 * 📄 DESCARGAR PDF
 */
router.get(
  "/:id/pdf",
  descargarTicketPDF
);

export default router;
