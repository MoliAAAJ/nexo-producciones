const API =
  window.location.origin;

/**
 * Helper seguro para fetch
 */
async function request(url, options = {}) {

  try {

    const res = await fetch(url, options);

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || "Error en request");
    }

    return data;

  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}

/**
 * EVENTOS
 */
export async function getEventos() {
  return request(`${API}/eventos`);
}

/**
 * ORDEN
 */
export async function crearOrden(data) {
  return request(`${API}/api/orden`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

/**
 * ADMIN (opcional pero ya te lo dejo listo)
 */
export async function getDashboard() {
  return request(`${API}/api/admin/dashboard`);
}

export async function getEventosAdmin() {
  return request(`${API}/api/admin/eventos`);
}

export async function getTickets() {
  return request(`${API}/api/admin/tickets?usados=false`);
}
