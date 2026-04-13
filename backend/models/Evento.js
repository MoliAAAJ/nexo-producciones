import mongoose from "mongoose";

const entradaSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  precio: {
    type: Number,
    required: true,
    min: 1
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: "El stock debe ser un número entero"
    }
  }
});

const eventoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      minlength: 3
    },
    descripcion: {
      type: String,
      trim: true
    },
    fecha: {
      type: Date,
      required: true
    },
    lugar: {
      type: String,
      trim: true
    },
    imagen: {
      type: String,
      trim: true
    },
    estado: {
      type: String,
      enum: ["activo", "agotado", "finalizado"],
      default: "activo",
      index: true
    },
    entradas: {
      type: [entradaSchema],
      validate: {
        validator: arr => arr.length > 0,
        message: "Debe haber al menos una entrada"
      }
    }
  },
  { timestamps: true }
);

// 🔎 Índices útiles
eventoSchema.index({ fecha: 1 });
eventoSchema.index({ estado: 1 });

export default mongoose.model("Evento", eventoSchema);
