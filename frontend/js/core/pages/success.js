"use strict";

const API = window.location.origin;

/**
 * 🖼️ IMAGE FIX
 */
function getImagen(img) {

  const fallback =
    "/assets/images/events/nexo_back.jpg";

  if (!img || typeof img !== "string") {
    return fallback;
  }

  if (img.startsWith("http")) {
    return img;
  }

  if (img.startsWith("/assets/")) {
    return img;
  }

  if (!img.includes("/")) {
    return `/assets/images/events/${img}`;
  }

  if (img.startsWith("imagenes/")) {
    return `/assets/images/events/${img.replace("imagenes/", "")}`;
  }

  return fallback;
}

/**
 * 🎯 INIT
 */
async function initSuccess() {

  const params =
    new URLSearchParams(window.location.search);

  const ordenId =
    params.get("orden_id") ||
    localStorage.getItem("last_order_id");

  const estado =
    document.getElementById("estado");

  const cont =
    document.getElementById("ticketsContainer");

  const eventoBox =
    document.getElementById("eventoBox");

  if (!ordenId) {

    estado.innerHTML =
      "❌ Orden inválida";

    return;
  }

  let data = null;

  /**
   * 🔥 WAIT LOOP
   */
  for (let i = 0; i < 30; i++) {

    estado.innerText =
      `Generando tickets... (${i + 1}/30)`;

    try {

      const res =
        await fetch(`${API}/api/orden/${ordenId}`);

      if (res.ok) {

        data = await res.json();

        /**
         * 🔥 SI YA EXISTEN
         */
        if (data?.tickets?.length) {
          break;
        }
      }

    } catch (err) {

      console.error(err);
    }

    await new Promise(r => setTimeout(r, 2000));
  }

  /**
   * ❌ FAIL
   */
  if (!data?.tickets?.length) {

    estado.innerHTML = `
      <div class="text-center">

        <div class="text-red-400 text-3xl font-bold">
          ❌ Tickets no generados
        </div>

        <p class="text-gray-400 mt-4">
          Esperá unos segundos y recargá la página.
        </p>

      </div>
    `;

    return;
  }

  /**
   * ✅ SUCCESS
   */
  estado.innerHTML = `
    <div class="text-green-400 text-3xl font-bold">
      ✅ Tickets listos
    </div>
  `;

  const orden = data.orden;

  /**
   * 🎫 EVENTO
   */
  if (orden?.evento_id) {

    const evento = orden.evento_id;

    const imagen =
      getImagen(evento.imagen);

    eventoBox.classList.remove("hidden");

    eventoBox.innerHTML = `
      <div class="bg-gray-900 rounded-3xl overflow-hidden border border-white/10">

        <img
          src="${imagen}"
          class="w-full h-72 object-cover"
          onerror="this.src='/assets/images/events/nexo_back.jpg'"
        />

        <div class="p-6">

          <h2 class="text-3xl font-extrabold">
            ${evento.nombre}
          </h2>

          <p class="text-gray-400 mt-3">
            📍 ${evento.lugar || ""}
            📌 ${evento.direccion || ""}
            🌎 ${evento.localidad || ""}
          </p>

        </div>

      </div>
    `;
  }

  /**
   * 🎟️ RENDER TICKETS
   */
  cont.innerHTML = "";

  data.tickets.forEach(ticket => {

    cont.innerHTML += `
      <div class="bg-gray-900 border border-white/10 p-6 rounded-3xl">

        <div class="flex items-center justify-between">

          <p class="text-purple-400 font-bold text-xl">
            ${ticket.tipo}
          </p>

          <span class="text-green-400 text-sm">
            Activo
          </span>

        </div>

        <img
          src="${ticket.qr_code}"
          class="w-52 mx-auto mt-6 bg-white p-3 rounded-2xl"
        />

        <button
          onclick="descargarPDF('${ticket._id}')"
          class="mt-6 w-full bg-purple-600 hover:bg-purple-700 transition py-4 rounded-2xl font-bold"
        >
          Descargar Ticket PDF
        </button>

      </div>
    `;
  });
}

/**
 * 📄 PDF
 */
window.descargarPDF = function(id) {

  window.open(
    `${API}/api/orden/ticket/${id}/pdf`,
    "_blank"
  );
};

initSuccess();
