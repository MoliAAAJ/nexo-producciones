"use strict";

/**
 * 🏠 INDEX PAGE LOGIC
 * Solo lógica de la home
 */

import { formatDate, money } from "../utils.js";

/**
 * 📦 STATE LOCAL
 */
let eventos = [];
let categoriaActual = "Todos";

/**
 * 🎯 INIT
 */
document.addEventListener("DOMContentLoaded", () => {
  cargarEventos();
});

/**
 * 📡 FETCH EVENTOS
 */
async function cargarEventos() {
  const contenedor = document.getElementById("eventosContainer");

  if (!contenedor) return;

  try {
    const API = window.location.origin;

    const res = await fetch(`${API}/eventos`);
    eventos = await res.json();

    render(eventos);

  } catch (err) {
    console.error(err);

    contenedor.innerHTML = `
      <p class="text-red-400 text-center">
        Error cargando eventos
      </p>
    `;
  }
}

/**
 * 🎨 RENDER EVENTOS
 */
function render(lista) {
  const contenedor = document.getElementById("eventosContainer");
  const cantidad = document.getElementById("cantidadEventos");

  if (!contenedor) return;

  if (cantidad) {
    cantidad.textContent = `${lista.length} eventos disponibles`;
  }

  contenedor.innerHTML = "";

  lista.forEach(ev => {
    const card = document.createElement("div");

    card.className =
      "bg-gray-800 rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition";

    card.onclick = () => {
      localStorage.setItem("evento", JSON.stringify(ev));
      window.location.href = "/pages/evento.html";
    };

    const precio = ev.entradas?.[0]?.precio || 0;

    card.innerHTML = `
      <img src="${ev.imagen}" class="h-48 w-full object-cover"/>

      <div class="p-4">
        <h3 class="text-xl font-bold text-purple-300">
          ${ev.nombre}
        </h3>

        <p class="text-gray-400 text-sm mt-1">
          ${formatDate(ev.fecha)} — ${ev.lugar || ""}
        </p>

        <p class="text-yellow-400 mt-2 font-semibold">
          ${money(precio)}
        </p>
      </div>
    `;

    contenedor.appendChild(card);
  });
}

/**
 * 🔍 FILTRO CATEGORÍAS (FUTURO)
 */
window.filtrarCategoria = function (cat) {
  categoriaActual = cat;

  const filtrados =
    cat === "Todos"
      ? eventos
      : eventos.filter(e => e.categoria === cat);

  render(filtrados);
};
