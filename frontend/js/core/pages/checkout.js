"use strict";

import { Storage } from "../core/storage.js";
import { crearOrden } from "../core/api.js";
import { $, money } from "../core/utils.js";

/**
 * 🎯 INICIAR PÁGINA DE CHECKOUT
 */
export function initCheckoutPage() {

  const evento = safeGet("evento");
  const orden = safeGet("orden_temp");
  const container = $("eventoInfo");

  if (!evento || !orden || !container) {
    renderFatalError();
    return;
  }

  let cantidad = 1;

  const entrada = getEntrada(evento);
  const precio = Number(entrada?.precio || 0);

  /**
   * 🧠 IMAGEN SAFE
   */
  const imagen = getImagen(evento);

  /**
   * 🎨 RENDER
   */
  renderEvento(container, evento, imagen);

  update();
  bindEvents();

  /**
   * =========================
   * CORE
   * =========================
   */

  function update() {

    const total = precio * cantidad;

    const cantidadEl = $("cantidad");
    const subtotalEl = $("subtotal");
    const totalEl = $("total");

    if (cantidadEl) cantidadEl.innerText = String(cantidad);
    if (subtotalEl) subtotalEl.innerText = money(total);
    if (totalEl) totalEl.innerText = money(total);
  }

  function sumar() {
    cantidad++;
    update();
  }

  function restar() {
    if (cantidad <= 1) return;
    cantidad--;
    update();
  }

  async function continuarPago() {

    const nombre = getValue("nombre");
    const apellido = getValue("apellido");
    const dni = getValue("dni");
    const email = getValue("email");
    const terms = $("terms")?.checked;

    if (!nombre || !apellido || !dni || !email) {
      return alert("Completa todos los campos");
    }

    if (!terms) {
      return alert("Acepta términos y condiciones");
    }

    const btn = $("btnComprar");
    if (!btn) return;

    btn.disabled = true;
    btn.innerText = "Procesando...";

    try {

      const data = await crearOrden({
        evento_id: evento._id,
        items: [
          {
            tipo: entrada?.tipo || "General",
            cantidad
          }
        ],
        cliente: {
          nombre,
          apellido,
          dni,
          email
        }
      });

      if (!data?.init_point) {
        throw new Error("Respuesta inválida");
      }

      window.location.href = data.init_point;

    } catch (err) {

      console.error(err);

      alert("Error en compra");

      btn.disabled = false;
      btn.innerText = "Continuar al pago";
    }
  }

  /**
   * =========================
   * EVENTOS
   * =========================
   */
  function bindEvents() {

    const btnSumar = $("btnSumar");
    const btnRestar = $("btnRestar");
    const btnComprar = $("btnComprar");

    if (btnSumar) btnSumar.addEventListener("click", sumar);
    if (btnRestar) btnRestar.addEventListener("click", restar);
    if (btnComprar) btnComprar.addEventListener("click", continuarPago);
  }

  /**
   * =========================
   * RENDER
   * =========================
   */
  function renderEvento(container, evento, imagen) {

    container.innerHTML = `
      <img
        src="${imagen}"
        class="rounded-3xl w-full h-[450px] object-cover"
        onerror="this.src='/assets/images/nexo_back.jpg'"
      />

      <h1 class="text-4xl font-bold mt-6">
        ${evento.nombre || "Evento"}
      </h1>
    `;
  }

  function renderFatalError() {
    document.body.innerHTML = `
      <div class="text-red-400 text-center p-10 text-2xl">
        Error cargando checkout
      </div>
    `;
  }

  /**
   * =========================
   * HELPERS
   * =========================
   */

  function safeGet(key) {
    try {
      return Storage.get(key);
    } catch {
      return null;
    }
  }

  function getEntrada(evento) {
    return Array.isArray(evento?.entradas)
      ? evento.entradas[0]
      : null;
  }

  function getValue(id) {
    return $(id)?.value?.trim() || "";
  }

  function getImagen(evento) {

    const img = evento?.imagen;

    const fallback = "/assets/images/events/nexo_back.jpg";

    if (!img || typeof img !== "string") {
      return fallback;
    }

    // 🔥 SI YA ES URL ABSOLUTA
    if (img.startsWith("http")) return img;

    // 🔥 SI YA VIENE BIEN FORMATEADA
    if (img.startsWith("/assets/")) return img;

    // 🔥 SI SOLO VIENE "1.jpg" o "nexo_back.jpg"
    if (!img.includes("/")) {
      return `/assets/images/events/${img}`;
    }

    // 🔥 SI VIENE MAL ARMADA /images/... o public/images/...
    const cleaned = img
      .replace("public/", "")
      .replace("/public", "")
      .replace("images/", "assets/images/")
      .replace("//", "/");

    return cleaned.startsWith("/")
      ? cleaned
      : `/${cleaned}`;
  }
}
