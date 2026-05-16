"use strict";

/**
 * 🎯 DOM SELECTOR SAFE
 */
export function $(id) {
  const el = document.getElementById(id);

  if (!el) {
    console.warn(`⚠️ Elemento #${id} no encontrado`);
    return null;
  }

  return el;
}

/**
 * 💰 FORMATO MONEDA SEGURO
 */
export function money(value) {
  const num = Number(value);

  if (isNaN(num)) return "$0";

  return `$${num.toLocaleString("es-AR")}`;
}

/**
 * 📅 FORMATO FECHA
 */
export function formatDate(dateStr) {
  if (!dateStr) return "";

  const date = new Date(dateStr);

  if (isNaN(date)) return dateStr;

  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

/**
 * ⚡ DEBOUNCE (buscador, inputs)
 */
export function debounce(fn, delay = 300) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

/**
 * 📦 SAFE JSON PARSE
 */
export function safeJSON(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

/**
 * 🧩 CLASS HELPERS
 */
export function addClass(el, cls) {
  if (el) el.classList.add(cls);
}

export function removeClass(el, cls) {
  if (el) el.classList.remove(cls);
}

export function toggleClass(el, cls) {
  if (el) el.classList.toggle(cls);
}
