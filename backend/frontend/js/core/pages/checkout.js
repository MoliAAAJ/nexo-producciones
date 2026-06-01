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
  let couponPercent = 0;
  let lastCouponChecked = "";

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

    const subtotal = precio * cantidad;

    let descuento = 0;

    if (couponPercent > 0) {
      descuento = subtotal * (couponPercent / 100);
    }

    const total = subtotal - descuento;

    const cantidadEl = $("cantidad");
    const subtotalEl = $("subtotal");
    const totalEl = $("total");
    const descuentoEl = $("descuento");
    const discountBox = $("discountBox");

    if (cantidadEl) {
      cantidadEl.innerText = String(cantidad);
    }

    if (subtotalEl) {
      subtotalEl.innerText = money(subtotal);
    }

    if (totalEl) {
      totalEl.innerText = money(total);
    }

    if (descuento > 0) {

      if (discountBox) {
        discountBox.classList.remove("hidden");
      }

      if (descuentoEl) {
        descuentoEl.innerText = `-${money(descuento)}`;
      }

    } else {

      if (discountBox) {
        discountBox.classList.add("hidden");
      }
    }
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

  /**
   * 🎟️ VALIDAR CUPÓN (ASYNC)
   */
  async function validarCuponLive() {
    const code = ($("codigo")?.value || "").trim().toUpperCase();
    const errorEl = $("cuponError");
    const codigoInput = $("codigo");
    
    if (!code) {
      couponPercent = 0;
      lastCouponChecked = "";
      if (errorEl) errorEl.classList.add("hidden");
      if (codigoInput) codigoInput.classList.remove("border-red-500", "border-green-500");
      update();
      return;
    }

    if (code === lastCouponChecked) return;

    try {
      const res = await fetch(`/api/orden/cupon/${code}`);
      const data = await res.json();
      
      lastCouponChecked = code;

      if (data.ok) {
        couponPercent = data.porcentaje;
        if (errorEl) errorEl.classList.add("hidden");
        if (codigoInput) {
          codigoInput.classList.remove("border-red-500");
          codigoInput.classList.add("border-green-500");
        }
      } else {
        couponPercent = 0;
        if (errorEl) {
          errorEl.innerText = data.message || "Cupón no válido";
          errorEl.classList.remove("hidden");
        }
        if (codigoInput) {
          codigoInput.classList.remove("border-green-500");
          codigoInput.classList.add("border-red-500");
        }
      }

      update();
    } catch {
      lastCouponChecked = "";
      couponPercent = 0;
      if (codigoInput) codigoInput.classList.add("border-red-500");
      if (errorEl) errorEl.classList.remove("hidden");
      update();
    }
  }

  /**
   * 📧 VALIDAR EMAIL
   */
  function validarEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(email);
  }

  async function continuarPago() {

    const nombre = getValue("nombre");
    const apellido = getValue("apellido");
    const dni = getValue("dni");
    const telefono = getValue("telefono");
    const email = getValue("email");

    const codigo =
      getValue("codigo")
        .toUpperCase();

    const terms =
      $("terms")?.checked;

    /**
     * 🔥 RESET ERRORES
     */
    $("emailError")
      ?.classList.add("hidden");

    $("termsError")
      ?.classList.add("hidden");

    /**
     * 🔥 VALIDAR CAMPOS
     */
    if (
      !nombre ||
      !apellido ||
      !dni ||
      !telefono ||
      !email
    ) {

      return alert(
        "Completa todos los campos"
      );
    }

    /**
     * 🔥 VALIDAR EMAIL
     */
    if (!validarEmail(email)) {

      $("emailError")
        ?.classList.remove("hidden");

      return;
    }

    /**
     * 🔥 VALIDAR TERMINOS
     */
    if (!terms) {

      $("termsError")
        ?.classList.remove("hidden");

      return;
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
          telefono,
          email
        },

        codigo_descuento: codigo
      });

      if (!data?.init_point) {
        throw new Error("Respuesta inválida");
      }

      window.location.href =
        data.init_point;

    } catch (err) {

      console.error(err);

      alert("Error en compra");

      btn.disabled = false;

      btn.innerText =
        "Continuar al pago";
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

    if (btnSumar) {
      btnSumar.addEventListener("click", sumar);
    }

    if (btnRestar) {
      btnRestar.addEventListener("click", restar);
    }

    if (btnComprar) {
      btnComprar.addEventListener("click", continuarPago);
    }

    /**
     * 🔥 CUPON LIVE
     */
    $("codigo")
      ?.addEventListener("input", validarCuponLive);
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

    const fallback =
      "/assets/images/events/nexo_back.jpg";

    if (!img || typeof img !== "string") {
      return fallback;
    }

    /**
     * 🔥 URL ABSOLUTA
     */
    if (img.startsWith("http")) {
      return img;
    }

    /**
     * 🔥 YA OK
     */
    if (img.startsWith("/assets/")) {
      return img;
    }

    /**
     * 🔥 SOLO NOMBRE
     */
    if (!img.includes("/")) {

      return `/assets/images/events/${img}`;
    }

    /**
     * 🔥 LIMPIAR
     */
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
