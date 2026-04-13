"use strict";

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/eventos"
    : "https://api.nexoesquel.com/eventos";

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
  contenedor.innerHTML = "<p class='text-gray-400 animate-pulse'>Cargando eventos...</p>";

  try {
    const response = await fetch(API_URL);
    const eventos = await response.json();
    contenedor.innerHTML = "";

    eventos.forEach(ev => {
      const nombre = ev.nombre || "Evento sin nombre";
      const fecha = ev.fecha || "";
      const lugar = ev.lugar || "";
      const imagen = ev.imagen || "";
      const estado = ev.estado?.toLowerCase() || "agotado";

      const valor = ev.entradas?.[0]?.precio || 100;

      const agotado = estado !== "activo";

      const tarjeta = document.createElement("div");
      tarjeta.className =
        "bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-transform";

      const imgWrapper = document.createElement("div");
      imgWrapper.className = "relative";

      const img = document.createElement("img");
      img.src = imagen || "imagenes/nexo_back.jpg";
      img.alt = nombre;
      img.className = "w-full h-48 object-cover bg-gray-700";
      img.loading = "lazy";

      img.onerror = () => {
        img.onerror = null;
        img.src = "imagenes/nexo_back.jpg";
      };

      imgWrapper.appendChild(img);

      if (agotado) {
        const badge = document.createElement("div");
        badge.className =
          "absolute top-2 left-2 bg-red-600 text-white font-bold px-3 py-1 rounded-lg text-sm";
        badge.textContent = "AGOTADO";
        imgWrapper.appendChild(badge);
      }

      const contenido = document.createElement("div");
      contenido.className = "p-5";

      const h3 = document.createElement("h3");
      h3.className = "text-xl font-semibold text-purple-300";
      h3.textContent = nombre;

      const pInfo = document.createElement("p");
      pInfo.className = "text-gray-400 text-sm mt-1";
      pInfo.textContent = `${formatearFecha(fecha)} — ${lugar}`;

      const pPrecio = document.createElement("p");
      pPrecio.className = "text-yellow-400 font-semibold text-lg mt-2";
      pPrecio.textContent = `💰 $${valor.toLocaleString("es-AR")}`;

      const boton = document.createElement("button");
      boton.className =
        `mt-4 w-full py-2 rounded-lg font-medium text-white ${
          agotado
            ? "bg-gray-700 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700"
        }`;

      boton.textContent = agotado ? "Agotado" : "Comprar entrada";

      if (!agotado) boton.onclick = () => abrirModal(valor);

      contenido.append(h3, pInfo, pPrecio, boton);
      tarjeta.append(imgWrapper, contenido);
      contenedor.appendChild(tarjeta);
    });

  } catch (error) {
    console.error(error);
    contenedor.innerHTML =
      "<p class='text-red-400'>Error al cargar los eventos.</p>";
  }
}

cargarEventos();
