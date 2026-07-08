import test from "node:test";
import assert from "node:assert/strict";

import { buildTicketValidationPayload } from "../utils/ticketValidation.js";

test("buildTicketValidationPayload devuelve los datos del evento y del cliente", () => {
  const ticket = {
    _id: "ticket-1",
    tipo: "VIP",
    orden_id: {
      cliente: {
        nombre: "Juan",
        apellido: "Pérez",
        dni: "12345678"
      },
      items: [{ tipo: "VIP", cantidad: 2 }]
    },
    evento_id: {
      nombre: "Festival de Verano",
      fecha: "2026-08-15T20:00:00.000Z",
      lugar: "Estadio Central"
    }
  };

  const payload = buildTicketValidationPayload(ticket);

  assert.equal(payload.ok, true);
  assert.equal(payload.message, "Ticket válido");
  assert.equal(payload.data.evento.nombre, ticket.evento_id.nombre);
  assert.equal(payload.data.cliente.nombreCompleto, "Juan Pérez");
  assert.equal(payload.data.cliente.dni, ticket.orden_id.cliente.dni);
  assert.equal(payload.data.tipoEntrada, ticket.tipo);
  assert.equal(payload.data.cantidadTickets, 2);
});
