# 🎭 NEXO Producciones

Sitio web oficial de **NEXO Producciones**, dedicado a la difusión y venta de entradas para eventos artísticos y culturales.

El proyecto está desarrollado como un **sitio estático**, optimizado para **GitHub Pages**, con diseño moderno usando **Tailwind CSS** y carga dinámica de eventos desde **Google Sheets**.

---

## 🌐 Demo

👉 https://moliaaaj.github.io/nexo-producciones/

---

## 🧱 Estructura del proyecto

```txt
/nexo-producciones
│── index.html        # Estructura principal del sitio
│── style.css         # Estilos personalizados (complemento de Tailwind)
│── script.js         # Lógica JS (fetch de eventos, modal de compra)
│── README.md
│── /imagenes
│   ├── nexo_logo_transparente.png
│   └── nexo_back.jpg

---

## ⚙️ Tecnologías utilizadas

* HTML5
* Tailwind CSS (CDN)
* JavaScript Vanilla (ES6+)
* Google Sheets como backend de eventos
* OpenSheet API para consumo de datos
* GitHub Pages para hosting

---

## 📊 Fuente de datos (Eventos)

Los eventos se cargan dinámicamente desde una hoja de cálculo de Google Sheets.

Cada fila debe contener las siguientes columnas:

| Columna | Descripción                         |
| ------- | ----------------------------------- |
| id      | Número de clave primaria            |
| nombre  | Nombre del evento                   |
| fecha   | Fecha (`DD/MM/YYYY` o `YYYY-MM-DD`) |
| lugar   | Lugar del evento                    |
| imagen  | URL de la imagen del evento         |
| link    | Link a Mercado Pago                 |
| estado  | `disponible` o `agotado`            |
| valor   | Precio de la entrada                |

---

## 🛒 Compra de entradas

* El botón “Comprar entrada” abre un modal.
* El usuario selecciona la cantidad de entradas.
* El total se calcula automáticamente.
* Se muestra el alias de pago (Mercado Pago).
* Las entradas quedan reservadas una vez acreditado el pago.

⚠️ Importante:
Este sitio no procesa pagos automáticamente.
El pago se realiza por fuera y la validación es manual.

---

## 🚀 Deploy en GitHub Pages

1. Subir el proyecto al repositorio nexo-producciones
2. Ir a Settings → Pages
3. Seleccionar:
  * Branch: main
  * Folder: /root
4. Guardar los cambios
5. Verificar que en index.html exista: <base href="/nexo-producciones/">

---

## 🧠 Buenas prácticas aplicadas

* Código modular (HTML / CSS / JS separados)
* Fetch asíncrono con manejo de errores
* Carga diferida de imágenes
* Diseño responsive
* Sin frameworks pesados
* Compatible con hosting estático

---

## 🔮 Posibles mejoras futuras

* Confirmación automática por WhatsApp
* Control de stock de entradas
* Panel de administración
* SEO avanzado (Open Graph / meta tags)
* Integración con pasarela de pagos
* Filtros por fecha, lugar o estado

---

## 📄 Licencia

© 2026 NEXO Producciones
Todos los derechos reservados.
