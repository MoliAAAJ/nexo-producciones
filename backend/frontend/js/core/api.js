const API =
  window.location.origin;

/**
 * HELPER PARA HACER REQUESTS A LA API
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
 * ADMIN
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
