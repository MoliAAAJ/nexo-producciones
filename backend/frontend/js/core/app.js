"use strict";

/**
 * 🌐 API BASE
 */
const API_URL = window.location.origin;

/**
 * 🧠 STATE CENTRALIZADO
 */
const State = {
  compraActual: null,
};

/**
 * 🔒 SAFE SELECTOR
 */
function $(id) {
  return document.getElementById(id);
}

/**
 * 🧠 INIT SYSTEM POR COMPONENTE
 */
const App = {
  init() {
    this.initModal();
    this.initEventos();
  },

  /**
   * 🎛️ MODAL SYSTEM
   */
  initModal() {
    const modal = $("modal");
    const cantidad = $("cantidadEntradas");
    const total = $("montoTotal");
    const btn = $("confirmarCompra");

    if (!modal || !cantidad || !total || !btn) return;

    cantidad.addEventListener("input", actualizarTotal);
    btn.addEventListener("click", crearOrden);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) cerrarModal();
    });

    function actualizarTotal() {
      if (!State.compraActual) return;

      const cantidadVal = Number(cantidad.value) || 1;
      const totalVal = cantidadVal * State.compraActual.precio;

      total.textContent = totalVal.toLocaleString("es-AR");
    }

    function cerrarModal() {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }

    function abrirModal(evento, entrada) {
      State.compraActual = {
        eventoId: evento._id,
        nombre: evento.nombre,
        precio: entrada.precio,
        tipo: entrada.tipo,
      };

      cantidad.value = 1;
      actualizarTotal();

      modal.classList.remove("hidden");
      modal.classList.add("flex");
    }

    async function crearOrden() {
      if (!State.compraActual) return;

      try {
        const cantidadVal = Number(cantidad.value) || 1;

        btn.disabled = true;
        btn.textContent = "Procesando...";

        const buyer = JSON.parse(localStorage.getItem("buyer"));

        if (!buyer) {
          window.location.href = "checkout.html";
          return;
        }

        const res = await fetch(`${API_URL}/api/orden`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            evento_id: State.compraActual.eventoId,
            items: [
              {
                tipo: State.compraActual.tipo,
                cantidad: cantidadVal,
              },
            ],
            cliente: buyer,
          }),
        });

        const data = await res.json();

        if (!data.ok) throw new Error(data.error || "Error orden");

        localStorage.setItem("orden_id", data.orden_id);

        window.location.href = data.init_point;
      } catch (err) {
        console.error(err);

        alert("Error procesando compra");

        btn.disabled = false;
        btn.textContent = "Confirmar";
      }
    }

    // 🔓 EXPONER SOLO LO NECESARIO
    window.abrirModal = abrirModal;
    window.cerrarModal = cerrarModal;
  },

  /**
   * 🎟️ EVENTOS SYSTEM
   */
  async initEventos() {
    const contenedor = $("eventos");

    if (!contenedor) return;

    contenedor.innerHTML =
      "<p class='text-gray-400'>Cargando eventos...</p>";

    try {
      const res = await fetch(`${API_URL}/eventos`);
      const eventos = await res.json();

      contenedor.innerHTML = "";

      eventos.forEach((ev) => {
        const card = document.createElement("div");

        card.className =
          "bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-transform";

        card.onclick = () => {
          localStorage.setItem("evento", JSON.stringify(ev));
          window.location.href = "/pages/evento.html";
        };

        card.innerHTML = `
          <div class="p-5">
            <h3 class="text-xl font-semibold text-purple-300">
              ${ev.nombre}
            </h3>

            <p class="text-gray-400 text-sm mt-1">
              ${ev.lugar || ""}
            </p>
          </div>
        `;

        contenedor.appendChild(card);
      });
    } catch (err) {
      console.error(err);

      contenedor.innerHTML =
        "<p class='text-red-400'>Error al cargar eventos</p>";
    }
  },
};

/**
 * 🚀 BOOT
 */
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
