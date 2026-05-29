import mongoose from "mongoose";

const cuponSchema = new mongoose.Schema(
  {
    codigo: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    porcentaje: { type: Number, required: true, min: 0, max: 100 },
    activo: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Cupon", cuponSchema, "cupones");