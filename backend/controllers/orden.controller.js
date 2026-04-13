import Evento from "../models/Evento.js";
import Orden from "../models/Orden.js";
import Ticket from "../models/Ticket.js";
import { generarQR } from "../utils/generarQR.js";

export const crearOrden = async (req, res) => {
  try {
    const { evento_id, items, cliente } = req.body;

    // 🔒 Validación básica
    if (!evento_id || !items || items.length === 0) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const evento = await Evento.findById(evento_id);

    if (!evento) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    let total = 0;
    const itemsFinal = [];
    const tickets = [];

    // 🔁 Procesar items
    for (const item of items) {
      const entrada = evento.entradas.find(
        e => e.tipo === item.tipo
      );

      if (!entrada) {
        return res.status(400).json({ error: "Entrada inválida" });
      }

      if (entrada.stock < item.cantidad) {
        return res.status(400).json({ error: "Stock insuficiente" });
      }

      const precio = entrada.precio;
      const subtotal = precio * item.cantidad;

      total += subtotal;

      itemsFinal.push({
        tipo: entrada.tipo,
        cantidad: item.cantidad,
        precio_unitario: precio
      });

      // 🎫 Generar tickets
      for (let i = 0; i < item.cantidad; i++) {
        const qr = generarQR();

        tickets.push({
          evento_id: evento._id,
          tipo: entrada.tipo,
          qr_code: qr
        });
      }

      // 📉 Descontar stock
      entrada.stock -= item.cantidad;
    }

    // 💾 Guardar cambios evento
    await evento.save();

    // 🧾 Crear orden
    const orden = await Orden.create({
      evento_id,
      cliente,
      items: itemsFinal,
      total
    });

    // 🎟️ Asociar orden a tickets
    const ticketsConOrden = tickets.map(t => ({
      ...t,
      orden_id: orden._id
    }));

    await Ticket.insertMany(ticketsConOrden);

    // ✅ Respuesta final
    res.json({
      ok: true,
      orden_id: orden._id,
      total
    });

  } catch (error) {
    console.error("❌ Error al crear orden:", error);
    res.status(500).json({ error: "Error al procesar compra" });
  }
};
