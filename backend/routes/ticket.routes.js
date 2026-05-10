import express from "express";

import Ticket from "../models/Ticket.js";

const router = express.Router();

router.post("/validar", async (req, res) => {

  try{

    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);

    if(!ticket){

      return res.json({
        ok:false,
        message:"Ticket inválido"
      });

    }

    if(ticket.usado){

      return res.json({
        ok:false,
        message:"Ticket ya utilizado"
      });

    }

    ticket.usado = true;

    await ticket.save();

    return res.json({
      ok:true,
      message:"Ticket válido"
    });

  }catch(error){

    console.error(error);

    return res.status(500).json({
      ok:false,
      message:"Error servidor"
    });

  }

});

export default router;
