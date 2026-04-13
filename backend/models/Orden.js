import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  tipo: String,
  cantidad: Number,
  precio_unitario: Number
});

const ordenSchema = new mongoose.Schema({
  evento_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Evento",
    required: true
  },

  cliente: {
    nombre: String,
    apellido: String,
    dni: String,
    email: String
  },

  items: [itemSchema],

  total: Number,

  estado: {
    type: String,
    enum: ["pendiente", "pagado", "cancelado"],
    default: "pendiente"
  },

  mp_payment_id: String

}, { timestamps: true });

export default mongoose.model("Orden", ordenSchema);
