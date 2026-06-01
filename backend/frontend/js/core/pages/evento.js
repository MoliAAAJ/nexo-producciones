"use strict";

import { Storage } from "../core/storage.js";
import { $ } from "../core/utils.js";

/**
 * 🎯 EVENTO PAGE BOOT
 */
export function initEventoPage() {

  const container = $("container");
  if (!container) return;

  const evento = safeGetEvento();

  if (!evento) {
    renderError(container);
    return;
  }

  renderEvento(container, evento);
  bindActions(evento);
}

/**
 * 🧯 SAFE GET
 */
function safeGetEvento() {
  try {
    const evento = Storage.get("evento");

    if (!evento || typeof evento !== "object") return null;

    return evento;
  } catch (e) {
    console.error("Error leyendo evento:", e);
    return null;
  }
}

/**
 * ❌ ERROR UI
 */
function renderError(container) {
  container.innerHTML = `
    <div class="text-center text-red-400 text-2xl">
      Evento no encontrado
    </div>
  `;
}

/**
 * 🧠 IMAGE NORMALIZER (CRÍTICO)
 */
function getImagen(evento) {

  const img = evento?.imagen;

  const fallback = "/assets/images/events/nexo_back.jpg";

  if (!img || typeof img !== "string") {
    return fallback;
  }

  // 🔥 URL externa (ej: cloudinary, etc)
  if (img.startsWith("http")) return img;

  // 🔥 ya viene bien estructurada
  if (img.startsWith("/assets/")) return img;

  // 🔥 solo filename (1.jpg)
  if (!img.includes("/")) {
    return `/assets/images/events/${img}`;
  }

  // 🔥 basura legacy (/images, public/images, etc)
  return img
    .replace("/public", "")
    .replace("public/", "")
    .replace("/images/", "/assets/images/")
    .replace("//", "/")
    .startsWith("/")
      ? img
      : `/assets/images/events/${img}`;
}

/**
 * 🎟️ RENDER EVENTO
 */
function renderEvento(container, evento) {

  const entrada = Array.isArray(evento.entradas)
    ? evento.entradas[0]
    : null;

  const stock = Number(entrada?.stock ?? 0);
  const agotado = stock <= 0;

  const nombre = evento.nombre || "Evento sin nombre";
  const descripcion = evento.descripcion || "";
  const categoria = evento.categoria || "Evento";

  const imagen = getImagen(evento);

  container.innerHTML = `
    <div class="grid lg:grid-cols-2 gap-10">

      <img
        src="${imagen}"
        alt="${nombre}"
        class="rounded-3xl w-full h-[500px] object-cover"
        onerror="this.src='/assets/images/nexo_back.jpg'"
      />

      <div>

        <span class="bg-purple-600 px-4 py-2 rounded-full text-sm">
          ${categoria}
        </span>

        <h1 class="text-5xl font-extrabold mt-5">
          ${nombre}
        </h1>

        <p class="mt-6 text-gray-300">
          ${descripcion}
        </p>

        <button
          id="btnComprar"
          class="mt-10 w-full py-5 rounded-2xl text-xl font-bold
          ${agotado
            ? "bg-gray-700 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700"}"
          ${agotado ? "disabled" : ""}
        >
          ${agotado ? "Agotado" : "Comprar"}
        </button>

      </div>

    </div>
  `;
}

/**
 * 🔗 ACCIONES DE COMPRA
 */
function bindActions(evento) {

  const btn = $("btnComprar");
  if (!btn) return;

  const entrada = Array.isArray(evento.entradas)
    ? evento.entradas[0]
    : null;

  const stock = Number(entrada?.stock ?? 0);
  const agotado = stock <= 0;

  if (agotado) return;

  btn.addEventListener("click", () => {

    Storage.set("orden_temp", {
      eventoId: evento._id || null,
      eventoNombre: evento.nombre || "",
      precio: Number(entrada?.precio || 0),
      cantidad: 1
    });

    window.location.href = "/pages/checkout.html";
  });
}
