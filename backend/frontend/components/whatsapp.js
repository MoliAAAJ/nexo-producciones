"use strict";

const WHATSAPP_NUMBER = "5492945645263";

function getWhatsappMessage() {
  const path = window.location.pathname;
  const evento = JSON.parse(localStorage.getItem("evento") || "null");
  const nombreEvento = evento?.nombre;

  if (path.includes("success")) {
    return "Hola, realicé una compra y necesito ayuda con mi entrada.";
  }

  if (path.includes("checkout")) {
    return "Hola, necesito ayuda para completar una compra.";
  }

  if (path.includes("evento")) {
    return nombreEvento
      ? `Hola, necesito hacer una consulta sobre el evento ${nombreEvento}.`
      : "Hola, necesito hacer una consulta sobre un evento.";
  }

  return "Hola, necesito hacer una consulta sobre los eventos disponibles.";
}

function renderWhatsappButton() {
  if (document.getElementById("whatsappConsultas")) return;

  const link = document.createElement("a");
  const message = encodeURIComponent(getWhatsappMessage());

  link.id = "whatsappConsultas";
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.title = "Consultas por WhatsApp";
  link.setAttribute("aria-label", "Consultas por WhatsApp");
  link.className = [
    "fixed",
    "right-5",
    "bottom-5",
    "z-40",
    "inline-flex",
    "items-center",
    "gap-2",
    "rounded-full",
    "bg-[#25D366]",
    "px-4",
    "py-3",
    "font-semibold",
    "text-white",
    "shadow-lg",
    "transition",
    "duration-200",
    "hover:scale-105",
    "hover:bg-[#1ebe5d]",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-[#25D366]",
    "focus:ring-offset-2",
    "focus:ring-offset-[#0f0f12]"
  ].join(" ");
  link.innerHTML = "<span aria-hidden=\"true\">💬</span><span>Consultas</span>";

  document.body.appendChild(link);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderWhatsappButton);
} else {
  renderWhatsappButton();
}
