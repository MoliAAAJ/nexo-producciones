import test from "node:test";
import assert from "node:assert/strict";

import { normalizeEventoEstado } from "../frontend/js/core/utils.js";

test("normalizeEventoEstado respeta el estado guardado en base de datos", () => {
  const fechaPasada = "2020-01-01T00:00:00.000Z";

  assert.equal(normalizeEventoEstado({ estado: "activo", fecha: fechaPasada }), "activo");
  assert.equal(normalizeEventoEstado({ estado: "agotado", fecha: fechaPasada }), "agotado");
  assert.equal(normalizeEventoEstado({ estado: "finalizado", fecha: "2099-01-01T00:00:00.000Z" }), "finalizado");
  assert.equal(normalizeEventoEstado({ fecha: fechaPasada }), "activo");
});
