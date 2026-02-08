"use strict";

const SHEET_URL =
  "https://opensheet.elk.sh/18eeA9-n97tamAFPmO9Do0WOiU9v9SI7QPms0P144Jic/Hoja%201";

const modal = document.getElementById("modal");
const cerrarModal = document.getElementById("cerrarModal");
const cantidadEntradas = document.getElementById("cantidadEntradas");
const montoTotalElem = document.getElementById("montoTotal");
const confirmarCompra = document.getElementById("confirmarCompra");

let valorActual = 0;

function abrirModal(valor) {
  valorActual = Number(valor) || 100;
  cantidadEntradas.value = 1;
  montoTotalElem.textContent = valorActual.toLocaleString("es-AR");
  modal.classList.remove("hidden");
}

cerrarModal.onclick = () => modal.classList.add("hidden");
modal.onclick = e => e.target === modal && modal.classList.add("hidden");

cantidadEntradas.oninput = () => {
  const cantidad = Number(cantidadEntradas.value) || 1;
  montoTotalElem.textContent =
    (cantidad * valorActual).toLocaleString("es-AR");
};

confirmarCompra.onclick = () => {
  alert(`Total a pagar: $${montoTotalElem.textContent}\nAlias: pepemoli.mp`);
  modal.classList.add("hidden");
};

function formatearFecha(fechaStr) {
  if (!fechaStr) return "";
  if (fechaStr.includes("/")) {
    const [d, m, y] = fechaStr.split("/");
    fechaStr = `${y}-${m}-${d}`;
  }
  const fecha = new Date(fechaStr);
  return isNaN(fecha)
    ? fechaStr
    : fecha.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
}

async function cargarEventos() {
  const contenedor = document.getElementById("eventos");
  contenedor.innerHTML = "<p class='text-gray-400'>Cargando eventos…</p>";

  try {
    const res = await fetch(SHEET_URL);
    const eventos = await res.json();
    contenedor.innerHTML = "";

    eventos.forEach(ev => {
      const agotado = ev.estado?.toLowerCase() !== "disponible";
      const valor = Number(ev.valor) || 100;

      const card = document.createElement("div");
      card.className =
        "bg-gray-800 rounded-2xl overflow-hidden shadow-lg";

      card.innerHTML = `
        <img src="${ev.imagen || "imagenes/nexo_back.jpg"}"
             class="w-full h-48 object-cover">
        <div class="p-5">
          <h3 class="text-xl text-purple-300 font-semibold">${ev.nombre}</h3>
          <p class="text-gray-400 text-sm">${formatearFecha(ev.fecha)} — ${ev.lugar}</p>
          <p class="text-yellow-400 font-semibold mt-2">💰 $${valor.toLocaleString("es-AR")}</p>
          <button class="mt-4 w-full py-2 rounded-lg ${
            agotado ? "bg-gray-700" : "bg-purple-600 hover:bg-purple-700"
          }">
            ${agotado ? "Agotado" : "Comprar entrada"}
          </button>
        </div>
      `;

      if (!agotado) {
        card.querySelector("button").onclick = () => abrirModal(valor);
      }

      contenedor.appendChild(card);
    });

  } catch {
    contenedor.innerHTML =
      "<p class='text-red-400'>Error al cargar los eventos.</p>";
  }
}

cargarEventos();
