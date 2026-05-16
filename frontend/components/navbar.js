// navbar.js - componente global NEXO

function renderNavbar() {
  const navbarHTML = `
    <header class="sticky top-0 z-50 bg-black/70 backdrop-blur border-b border-white/10">

      <div class="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">

        <!-- LOGO -->
        <img
          src="/public/assets/logo.png"
          alt="NEXO"
          class="h-24 w-auto cursor-pointer"
          onclick="window.location.href='/'"
        />

        <!-- BOTÓN AYUDA -->
        <button
          onclick="abrirModal()"
          class="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-xl text-sm font-semibold"
        >
          Ayuda
        </button>

        <!-- TITULO -->
        <h1 class="text-xl font-extrabold text-purple-400">
          NEXO <span class="text-white">Tickets</span>
        </h1>

      </div>

    </header>
  `;

  const mountPoint = document.getElementById("navbar");
  if (mountPoint) {
    mountPoint.innerHTML = navbarHTML;
  }
}

// auto-ejecutar
document.addEventListener("DOMContentLoaded", renderNavbar);
