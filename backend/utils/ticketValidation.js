export function buildTicketValidationPayload(ticket) {
  const cliente = ticket?.orden_id?.cliente || {};
  const evento = ticket?.evento_id || {};
  const items = Array.isArray(ticket?.orden_id?.items) ? ticket.orden_id.items : [];

  const cantidadTickets = items.reduce((total, item) => {
    if (item?.tipo === ticket?.tipo) {
      return total + Number(item.cantidad || 0);
    }
    return total;
  }, 0);

  const nombreCompleto = [cliente.nombre, cliente.apellido]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    ok: true,
    message: "Ticket válido",
    data: {
      evento: {
        nombre: evento.nombre || "Evento",
        fecha: evento.fecha
          ? new Date(evento.fecha).toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "long",
              year: "numeric"
            })
          : null,
        lugar: evento.lugar || null
      },
      cliente: {
        nombreCompleto,
        dni: cliente.dni || null
      },
      tipoEntrada: ticket?.tipo || null,
      cantidadTickets: cantidadTickets > 0 ? cantidadTickets : 1
    }
  };
}
