"use strict";

/**
 * 🏠 INDEX LOGIC
 * Home con blindaje de imágenes y datos
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
  console.log("🚀 index.js cargado correctamente");
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
    console.log("📦 Eventos recibidos:", eventos);

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
 * 🧠 NORMALIZAR IMAGEN
 */
function getImagen(ev) {
  const fallback = "/assets/images/events/nexo_back.jpg";
  const img = ev.imagen;

  if (!img || typeof img !== "string") return fallback;

  if (img.startsWith("http")) return img;
  if (img.startsWith("/assets/")) return img;
  
  if (!img.includes("/")) return `/assets/images/events/${img}`;

  if (img.startsWith("images/")) return `/assets/${img}`;

  if (img.includes("public")) return img.replace("public", "");

  const cleaned = img
    .replace("public/", "")
    .replace("/public", "")
    .replace("images/", "assets/images/")
    .replace("//", "/");

  return cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
}

/**
 * 🎨 RENDER EVENTOS
 */
function render(lista) {
  const contenedor = document.getElementById("eventosContainer");
  const cantidad = document.getElementById("cantidadEventos");

  if (!contenedor) return;

  console.log("🎨 Renderizando lista de eventos:", lista.length);

  // Calculamos solo los que no están finalizados para el contador
  if (cantidad) {
    const ahora = Date.now();
    const disponibles = lista.filter(ev => {
      const isFinalizado = String(ev.estado || "") === "finalizado" || 
                           new Date(ev.fecha).getTime() < ahora;
      return !isFinalizado;
    }).length;
    cantidad.innerText = `${disponibles} eventos disponibles`;
  }

  contenedor.innerHTML = "";

  lista.forEach(ev => {
    const card = document.createElement("div");

    card.className = 
      "bg-gray-900 rounded-3xl overflow-hidden border border-white/10 transition shadow-xl";

    const precio = ev.entradas?.[0]?.precio || 0;
    const imagen = getImagen(ev);

    // Configuración de la "burbuja" de estado
    const statusConfig = {
      activo: { label: "Disponible", color: "bg-green-600" },
      agotado: { label: "Agotado", color: "bg-orange-600" },
      finalizado: { label: "Finalizado", color: "bg-gray-600 opacity-70" }
    };
    
    // Determinamos el estado real (incluyendo fecha)
    let estadoReal = ev.estado || "activo";
    if (estadoReal !== "finalizado" && new Date(ev.fecha).getTime() < Date.now()) {
      estadoReal = "finalizado";
    }

    const status = statusConfig[estadoReal] || statusConfig.activo;

    card.innerHTML = `
      <div class="relative">
        <img
          src="${imagen}"
          class="h-64 w-full object-cover"
          onerror="this.src='/assets/images/nexo_back.jpg'"
        />
        <span class="absolute top-3 right-3 ${status.color} text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full shadow-lg">
          ${status.label}
        </span>
      </div>

      <div class="p-4">
        <h3 class="text-xl font-bold text-purple-300">
          ${ev.nombre || "Evento sin nombre"}
        </h3>

        <p class="text-gray-400 text-sm mt-1">
          ${formatDate(ev.fecha)} — ${ev.lugar || ""}
        </p>

        <p class="text-yellow-400 mt-2 font-semibold">
          ${money(precio)}
        </p>

        <button
          class="mt-5 w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-bold transition-colors"
        >
          Ver evento
        </button>
      </div>
    `;

    // Asignamos la acción solo al botón para evitar que toda la tarjeta sea clickable
    card.querySelector("button").onclick = () => {
      localStorage.setItem("evento", JSON.stringify(ev));
      window.location.href = "/pages/evento.html";
    };

    contenedor.appendChild(card);
  });
}

/**
 * 🔍 FILTRO CATEGORÍAS
 */
window.filtrarCategoria = function (cat) {
  categoriaActual = cat;

  const filtrados =
    cat === "Todos"
      ? eventos
      : eventos.filter(e => e.categoria === cat);

  render(filtrados);
};
