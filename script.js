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

let compraActual = {
  eventoId: null,
  nombre: "",
  precio: 0,
  tipo: ""
};

function abrirModal(evento, entrada) {
  compraActual = {
    eventoId: evento._id,
    nombre: evento.nombre,
    precio: entrada.precio,
    tipo: entrada.tipo
  };

  cantidadEntradas.value = 1;
  actualizarTotal();
  modal.classList.remove("hidden");
}

function cerrarModalFn() {
  modal.classList.add("hidden");
}

cerrarModal.onclick = cerrarModalFn;

modal.onclick = e => {
  if (e.target === modal) cerrarModalFn();
};

cantidadEntradas.oninput = actualizarTotal;

function actualizarTotal() {
  const cantidad = Number(cantidadEntradas.value) || 1;
  const total = cantidad * compraActual.precio;
  montoTotalElem.textContent = total.toLocaleString("es-AR");
}

confirmarCompra.onclick = () => {
  const cantidad = Number(cantidadEntradas.value) || 1;

  console.log("🧾 Compra:", {
    ...compraActual,
    cantidad,
    total: cantidad * compraActual.precio
  });

  alert(
    `Evento: ${compraActual.nombre}
Entrada: ${compraActual.tipo}
Cantidad: ${cantidad}
Total: $${montoTotalElem.textContent}

Alias: pepemoli.mp`
  );

  cerrarModalFn();
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
  contenedor.innerHTML =
    "<p class='text-gray-400 animate-pulse'>Cargando eventos...</p>";

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

      contenido.append(h3, pInfo);

      // 🎟️ MULTIPLES ENTRADAS
      if (!agotado && ev.entradas?.length) {
        ev.entradas.forEach(entrada => {
          const precio = entrada.precio || 0;

          const pPrecio = document.createElement("p");
          pPrecio.className =
            "text-yellow-400 font-semibold text-md mt-2";
          pPrecio.textContent =
            `${entrada.tipo}: $${precio.toLocaleString("es-AR")}`;

          const boton = document.createElement("button");
          boton.className =
            "mt-2 w-full py-2 rounded-lg font-medium text-white bg-purple-600 hover:bg-purple-700";

          boton.textContent = `Comprar ${entrada.tipo}`;
          boton.onclick = () => abrirModal(ev, entrada);

          contenido.append(pPrecio, boton);
        });
      } else {
        const agotadoTxt = document.createElement("p");
        agotadoTxt.className = "text-red-400 mt-3 font-semibold";
        agotadoTxt.textContent = "Entradas agotadas";
        contenido.appendChild(agotadoTxt);
      }

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
