import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  orden_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Orden"
  },

  evento_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Evento"
  },

  tipo: String,

  qr_code: String,

  usado: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export default mongoose.model("Ticket", ticketSchema);
