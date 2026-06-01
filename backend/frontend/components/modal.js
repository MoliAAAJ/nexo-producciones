// SISTEMA GLOBAL DE MODALES

export function abrirModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

export function cerrarModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;

  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

// COMPATIBILIDAD GLOBAL PARA MODALES (HTML VIEJOS)
window.abrirModal = function () {
  const modal = document.getElementById("modalAyuda") || document.getElementById("faqModal");
  if (!modal) return;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
};

window.cerrarModal = function () {
  const modal = document.getElementById("modalAyuda") || document.getElementById("faqModal");
  if (!modal) return;

  modal.classList.add("hidden");
  modal.classList.remove("flex");
};

window.abrirFAQ = window.abrirModal;
window.cerrarFAQ = window.cerrarModal;

window.abrirTerminos = function () {
  const modal = document.getElementById("modalTerminos");
  if (!modal) return;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
};

window.cerrarTerminos = function () {
  const modal = document.getElementById("modalTerminos");
  if (!modal) return;

  modal.classList.add("hidden");
  modal.classList.remove("flex");
};
