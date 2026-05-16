"use strict";

import { Storage } from "../core/storage.js";
import { crearOrden } from "../core/api.js";
import { $ , money } from "../core/utils.js";

/**
 * 🎯 INIT CHECKOUT PAGE
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
   * 🎨 INIT RENDER
   */
  renderEvento(container, evento);

  /**
   * 💰 FIRST RENDER
   */
  update();

  /**
   * 🔗 BIND UI EVENTS
   */
  bindEvents();

  /**
   * =========================
   * CORE FUNCTIONS
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

      if (!data || !data.init_point) {
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
   * BINDING LIMPIO (NO onclick HTML)
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
  function renderEvento(container, evento) {

    container.innerHTML = `
      <img
        src="${evento.imagen || ""}"
        class="rounded-3xl w-full h-[450px] object-cover"
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
   * SAFE HELPERS
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
}
