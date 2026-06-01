# 🎟️ NEXOPass

Sistema de venta de entradas online con frontend estático, backend en Node.js/Express, base de datos MongoDB y pasarela de pago MercadoPago.

## 📖 Guía de Uso (Para el Administrador)

Esta sección explica cómo operar el sistema una vez que está instalado.

### 1. Panel de Administración
Para acceder al panel de control, ingresá a la ruta **"/admin/dashboard.html"** (o la URL que te haya proporcionado el desarrollador). Deberás ingresar el usuario y contraseña configurados.

*   **Dashboard:** Visualizá el total de ventas, ingresos recaudados y el porcentaje de tickets usados en tiempo real.
*   **Gestión de Eventos:** En el listado de eventos podés ver el estado de cada uno. 
    *   **ACTIVO**: El evento está a la venta.
    *   **AGOTADO**: Se muestra en la web pero no permite comprar.
    *   **FINALIZADO**: El evento ya pasó. El sistema lo marca automáticamente según la fecha, pero podés cambiarlo manualmente en la base de datos.

### 2. Gestión de Cupones de Descuento
El sistema cuenta con códigos de descuento pre-configurados (**NEXO10, NEXO20, NEXO30, NEXO40, NEXO50**).
*   Para **activar o desactivar** un código, se debe solicitar al administrador de la base de datos que cambie el estado **activo** a **true** (activado) o **false** (desactivado).
*   Los descuentos se aplican sobre el subtotal de la compra de forma automática.

### 3. Control de Ingreso (Acreditaciones)
El sistema permite validar los tickets en la puerta del evento:
*   Cada ticket enviado por mail tiene un **Código QR único**.
*   Al escanearlo, el sistema informará si el ticket es válido o si ya fue utilizado anteriormente.
*   Podés descargar el **Listado de Compradores en PDF** desde el panel de reportes para tener una lista de papel si fuera necesario.

---

<div style="page-break-after: always;"></div>

## 🛠️ Documentación Técnica (Para Desarrolladores)

Información sobre el funcionamiento interno del sistema.

### Características principales
- Checkout con MercadoPago Checkout PRO
- Creación automática de órdenes y tickets
- Generación de tickets QR y PDF
- Envío de ticket por email tras el pago
- Panel administrativo con métricas y filtros
- Exportación de listado PDF de compradores por evento
- Validación de tickets desde API

---

## 🚀 Tecnologías

### Frontend
- HTML5
- CSS3
- JavaScript Vanilla
- Tailwind CSS (CDN)

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- MercadoPago SDK
- Nodemailer
- QRCode
- PDFKit

---

## 📁 Estructura del proyecto

```txt
nexo-producciones/
├── backend/
│   ├── assets/
│   ├── config/
│   │   ├── db.js
│   │   └── mp.js
│   ├── controllers/
│   │   └── orden.controller.js
│   ├── models/
│   │   ├── Cupon.js
│   │   ├── Evento.js
│   │   ├── Orden.js
│   │   └── Ticket.js
│   ├── routes/
│   │   ├── admin.routes.js
│   │   ├── mp.routes.js
│   │   ├── orden.routes.js
│   │   ├── reportes.routes.js
│   │   └── ticket.routes.js
│   ├── utils/
│   │   ├── enviarTicketsEmail.js
│   │   ├── generarPDF.js
│   │   └── generarQR.js
│   ├── seed_cupones.mongodb.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── admin/
│   │   └── dashboard.html
│   ├── components/
│   │   ├── header.html
│   │   └── footer.html
│   ├── js/
│   │   ├── core/
│   │   │   └── api.js
│   │   └── pages/
│   │       ├── admin.js
│   │       ├── checkout.js
│   │       └── home.js
│   ├── pages/
│   │   ├── index.html
│   │   └── evento.html
│   ├── payments/
│   │   ├── success.html
│   │   └── pending.html
│   ├── public/
│   │   └── assets/
│   │       └── images/
│   │           └── branding/
│   │               └── nexo_logo_transparente.png
│   └── styles/
│       └── tailwind-custom.css
└── README.md
```

---

## ⚙️ Instalación y configuración

1. Clona el repositorio:

> **COMANDO:** git clone <repo-url>

2. Entra al backend:

> **COMANDO:** cd ../nexo-producciones/backend

3. Instala dependencias:

> **COMANDO:** npm install

4. Crea el archivo **.env** con estas variables:

**CONFIGURACIÓN (.env):**
PORT=3000

MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.xxxx.mongodb.net/nexo

BASE_URL=http://localhost:3000

FRONT_URL=http://localhost:3000

MERCADOPAGO_ACCESS_TOKEN=TEST-XXXXXXXX

EMAIL_USER=tucorreo@gmail.com

EMAIL_PASS=xxxxxxxx

> Usa credenciales válidas de MercadoPago y Gmail para pruebas. Si usas Gmail, habilita el acceso seguro o App Password si estás con 2FA.

5. Asegúrate de que MongoDB esté corriendo:

> **COMANDO:** sudo systemctl start mongod

---

## ▶️ Ejecución

Desde la carpeta **"backend"**:

> **EJECUTAR:** npm run dev

o en producción:

> **EJECUTAR:** npm start

---

### 🌐 Rutas principales

#### Rutas públicas
- **GET /eventos** — lista eventos activos
- **GET /** — sirve el frontend estático

### API de ordenes
- **POST /api/orden** — crea una orden y genera preference de MercadoPago
- **GET /api/orden/cupon/:codigo** — valida si un cupón existe y está activo
- **GET /api/orden/:id** — obtiene orden y tickets asociados
- **GET /api/orden/ticket/:id/pdf** — descarga ticket en PDF

### Webhook de MercadoPago
- **POST /mp/webhook** — recibe notificaciones de pago, marca la orden como **PAGADO**, genera tickets y dispara el email

### Validación de tickets
- **POST /api/ticket/validar** — marca ticket como usado si es válido
- **GET /api/ticket/:id/pdf** — descarga PDF del ticket

### Panel administrativo
- **GET /api/admin/dashboard** — métricas generales
- **GET /api/admin/tickets?usados=false|true** — lista de tickets filtrados
- **GET /api/admin/eventos** — estadísticas por evento

### Reportes
- **GET /api/reportes/eventos/:id/pdf** — exporta listado de compradores de un evento en PDF

---

### 🧾 Modelos de datos

#### Cupon
- **CODIGO** (único, uppercase), **PORCENTAJE**, **ACTIVO** (booleano)
- Timestamps para trazabilidad

#### Evento
- **NOMBRE**, **DESCRIPCION**, **FECHA**, **LUGAR**, **DIRECCION**, **LOCALIDAD**, **IMAGEN**, **ESTADO**
- **ENTRADAS**: Lista con **TIPO**, **PRECIO**, **STOCK**

#### Orden
- **EVENTO_ID** (referencia a Evento)
- **CLIENTE**: **NOMBRE**, **APELLIDO**, **DNI**, **EMAIL**
- **ITEMS**: **TIPO**, **CANTIDAD**, **PRECIO_UNITARIO**
- **TOTAL**, **DESCUENTO**, **CODIGO_DESCUENTO**, **ESTADO**

#### Ticket
- **ORDEN_ID**, **EVENTO_ID**
- **TIPO** (Ej: General, VIP)
- **QR_CODE** (Datos del código)
- **ESTADO_USADO** (Si ya ingresó)

---

## 🔧 Flujos importantes

### Compra normal
1. El frontend carga eventos desde **GET /eventos**.
2. El usuario elige evento, completa datos y crea orden.
3. Backend crea orden en Mongo y genera preference en MercadoPago.
4. El usuario paga en MercadoPago y regresa a la app.
5. MercadoPago envía webhook a **/mp/webhook**.
6. Backend marca orden como pagada, crea tickets y envía email con el PDF.

### Validación de ticket
1. El scanner o admin envía el **ID del Ticket** a la ruta **POST /api/ticket/validar**.
2. Si el ticket existe y no fue usado, se marca como usado.

---

## 📌 Notas

- El frontend es estático y se sirve desde **backend/server.js**.
- El archivo **frontend/public/assets/images/branding/nexo_logo_transparente.png** se usa en PDFs.
- El email envía un enlace a **BASE_URL/api/orden/ticket/:id/pdf** para descargar el ticket.
- Si necesitas pruebas de webhook en desarrollo, usa **ngrok** o una solución similar.

---

## 🧪 Observaciones adicionales

- El sistema usa un **sistema de cupones dinámico** gestionado en la base de datos (Colección **cupones**).
- El sistema guarda órdenes en estado **PENDIENTE** y solo genera tickets cuando MercadoPago confirma el pago.
- El backend usa **express.static** para servir el **frontend** y las carpetas de **assets**.

---

## 📦 Librerías Principales

El sistema utiliza las siguientes herramientas para garantizar el funcionamiento:

*   **EXPRESS / CORS / HELMET**: Servidor web y seguridad.
*   **MONGOOSE / MONGODB**: Gestión de base de datos.
*   **MERCADOPAGO**: Procesamiento de pagos.
*   **NODEMAILER**: Envío de correos electrónicos.
*   **PDFKIT**: Generación de tickets y reportes.
*   **QRCODE**: Creación de códigos para acreditación.
*   **DOTENV**: Configuración de variables de entorno.

---

## 📬 Contacto

Para dudas o mejoras, me podes enviar un mail a moliaaaj@gmail.com.


[Ngrok Official Website](https://ngrok.com?utm_source=chatgpt.com)

> **COMANDO NGROK:** ngrok http 3000

**ACTUALIZAR .ENV CON LA URL DE NGROK:**

*   **BASE_URL** = https://xxxxx.ngrok-free.app
*   **FRONT_URL** = https://xxxxx.ngrok-free.app

---

# 📧 GMAIL APP PASSWORD

Para envío de emails:

## Activar:
- Verificación en dos pasos

## Generar:
- App Password

**CONFIGURAR EN .ENV:**

*   **EMAIL_PASS** = (Pegar aquí la contraseña de aplicación generada)

NO usar la contraseña normal de Gmail.

---

# 🎟️ FUNCIONALIDADES

## Cliente

- Ver eventos
- Comprar entradas
- MercadoPago Checkout
- Recibir tickets QR
- Descargar PDFs

## Admin

- Descargar listado PDF de compradores
- Validación QR
- Control de tickets usados

---

# 📄 PDFs

Se generan automáticamente:

- Ticket individual
- Listado de compradores

---

# 🔐 VALIDACIÓN QR

Cada ticket contiene:

- **ID UNICO DE CONTROL**
- **ESTADO DE USO**

El scanner marca:
*   **TICKET VALIDO**: El cliente puede pasar.
*   **TICKET YA USADO**: El sistema bloquea el ingreso.

---

# 🚀 DEPLOY FUTURO

Opciones recomendadas:

- Railway
- Render
- VPS Ubuntu
- Docker
- Coolify

---

# 🧠 NOTAS IMPORTANTES

## Tailwind CDN

Actualmente se usa CDN:

```html
<script src="https://cdn.tailwindcss.com"></script>
```

Más adelante migrar a:

- Tailwind CLI
- Vite

---

# 🛠️ COMANDOS ÚTILES

## Reiniciar backend
> **ACCION:** Presionar **CTRL + C** y luego ejecutar **npm run dev**

## Ver logs Mongo
> **COMANDO:** mongosh

## Probar API
> **URL DE PRUEBA:** http://localhost:3000/eventos

---

# ✅ FLUJO COMPLETO

1. Cliente entra al evento
2. Selecciona cantidad
3. Completa checkout
4. MercadoPago procesa
5. Webhook confirma pago
6. Se generan tickets QR
7. PDFs disponibles
8. Email enviado
9. Cliente descarga tickets

---

# 👨‍💻 AUTOR

Proyecto desarrollado por José Luis Moliterno

## NEXO Producciones

Sistema de tickets y eventos culturales.
