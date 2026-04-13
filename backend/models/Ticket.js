import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    orden_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Orden",
      required: true,
      index: true
    },

    evento_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Evento",
      required: true,
      index: true
    },

    entrada_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    tipo: {
      type: String,
      required: true,
      trim: true
    },

    qr_code: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    usado: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);
