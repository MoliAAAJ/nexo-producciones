import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // timeout conexión
      socketTimeoutMS: 45000
    });

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📦 Base de datos: ${conn.connection.name}`);

  } catch (error) {
    console.error("❌ Error MongoDB:", error.message);
    process.exit(1);
  }
};

// 📡 Eventos de conexión (MUY importante)
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB desconectado");
});

mongoose.connection.on("reconnected", () => {
  console.log("🔄 MongoDB reconectado");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Error en MongoDB:", err.message);
});
