import mongoose from "mongoose";

const entradaSchema = new mongoose.Schema({
  tipo: { type: String, required: true },
  precio: { type: Number, required: true },
  stock: { type: Number, required: true }
});

const eventoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  fecha: { type: Date, required: true },
  lugar: String,
  imagen: String,
  estado: {
    type: String,
    enum: ["activo", "agotado", "finalizado"],
    default: "activo"
  },
  entradas: [entradaSchema]
}, { timestamps: true });

export default mongoose.model("Evento", eventoSchema);
