import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: true
  },
  cantidad: {
    type: Number,
    required: true
  },
  precio_unitario: {
    type: Number,
    required: true
  }
});

const ordenSchema = new mongoose.Schema(
  {
    evento_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Evento",
      required: true
    },

    cliente: {
      nombre: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
      },
      apellido: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
      },
      dni: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Email inválido"],
        index: true
      }
    },

    items: {
      type: [itemSchema],
      validate: {
        validator: arr => arr.length > 0,
        message: "Debe haber al menos un item"
      }
    },

    total: {
      type: Number,
      required: true,
      min: 1
    },

    estado: {
      type: String,
      enum: ["pendiente", "pagado", "cancelado"],
      default: "pendiente",
      index: true
    },

    mp_payment_id: {
      type: String,
      index: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Orden", ordenSchema);
