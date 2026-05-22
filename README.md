# 🎟️ NEXO Producciones

Sistema de venta de entradas online con frontend estático, backend en Node.js/Express, base de datos MongoDB y pasarela de pago MercadoPago.

## Características principales
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
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── admin/
│   ├── components/
│   ├── js/
│   │   ├── core/
│   │   └── pages/
│   ├── pages/
│   ├── payments/
│   ├── public/
│   │   └── assets/
│   └── styles/
└── README.md
```

---

## ⚙️ Instalación y configuración

1. Clona el repositorio:

```bash
git clone <repo-url>
```

2. Entra al backend:

```bash
cd ../nexo-producciones/backend
```

3. Instala dependencias:

```bash
npm install
```

4. Crea el archivo `.env` con estas variables:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/nexo
BASE_URL=http://localhost:3000
FRONT_URL=http://localhost:3000
MERCADOPAGO_ACCESS_TOKEN=TEST-XXXXXXXX
EMAIL_USER=tucorreo@gmail.com
EMAIL_PASS=xxxxxxxx
```

> Usa credenciales válidas de MercadoPago y Gmail para pruebas. Si usas Gmail, habilita el acceso seguro o App Password si estás con 2FA.

5. Asegúrate de que MongoDB esté corriendo:

```bash
sudo systemctl start mongod
```

---

## ▶️ Ejecución

Desde la carpeta `backend`:

```bash
npm run dev
```

o en producción:

```bash
npm start
```

---

## 🌐 Rutas principales

### Rutas públicas
- `GET /eventos` — lista eventos activos
- `GET /*` — sirve el frontend estático

### API de ordenes
- `POST /api/orden` — crea una orden y genera preference de MercadoPago
- `GET /api/orden/:id` — obtiene orden y tickets asociados
- `GET /api/orden/ticket/:id/pdf` — descarga ticket en PDF

### Webhook de MercadoPago
- `POST /mp/webhook` — recibe notificaciones de pago, marca la orden como `pagado`, genera tickets y dispara el email

### Validación de tickets
- `POST /api/ticket/validar` — marca ticket como usado si es válido
- `GET /api/ticket/:id/pdf` — descarga PDF del ticket

### Panel administrativo
- `GET /api/admin/dashboard` — métricas generales
- `GET /api/admin/tickets?usados=false|true` — lista de tickets filtrados
- `GET /api/admin/eventos` — estadísticas por evento

### Reportes
- `GET /api/reportes/eventos/:id/pdf` — exporta listado de compradores de un evento en PDF

---

## 🧾 Modelos de datos

### Evento
- `nombre`, `descripcion`, `fecha`, `lugar`, `direccion`, `localidad`, `imagen`, `estado`
- `entradas`: array con `tipo`, `precio`, `stock`

### Orden
- `evento_id` (referencia a Evento)
- `cliente`: `nombre`, `apellido`, `dni`, `email`
- `items`: `tipo`, `cantidad`, `precio_unitario`
- `total`, `descuento`, `codigo_descuento`, `estado`

### Ticket
- `orden_id`, `evento_id`
- `tipo`
- `qr_code`
- `usado`

---

## 🔧 Flujos importantes

### Compra normal
1. El frontend carga eventos desde `GET /eventos`.
2. El usuario elige evento, completa datos y crea orden.
3. Backend crea orden en Mongo y genera preference en MercadoPago.
4. El usuario paga en MercadoPago y regresa a la app.
5. MercadoPago envía webhook a `/mp/webhook`.
6. Backend marca orden como pagada, crea tickets y envía email con el PDF.

### Validación de ticket
1. El scanner o admin envía `ticketId` a `POST /api/ticket/validar`.
2. Si el ticket existe y no fue usado, se marca como usado.

---

## 📌 Notas

- El frontend es estático y se sirve desde `backend/server.js`.
- El archivo `frontend/public/assets/images/branding/nexo_logo_transparente.png` se usa en PDFs.
- El email envía un enlace a `BASE_URL/api/orden/ticket/:id/pdf` para descargar el ticket.
- Si necesitas pruebas de webhook en desarrollo, usa `ngrok` o una solución similar.

---

## 🧪 Observaciones adicionales

- El descuento fijo propuesto es `NEXO10` y aplica 10% en backend.
- El sistema guarda órdenes en estado `pendiente` y solo genera tickets cuando MercadoPago confirma el pago.
- El backend usa `express.static` para servir `frontend` y `frontend/public/assets`.

---

## 📦 Dependencias clave

```json
{
  "dependencies": {
    "cors": "^2.8.6",
    "dotenv": "^16.6.1",
    "express": "^4.22.2",
    "helmet": "^8.1.0",
    "mercadopago": "^2.12.0",
    "mongodb": "^7.1.1",
    "mongoose": "^8.23.1",
    "nodemailer": "^8.0.7",
    "pdfkit": "^0.18.0",
    "qrcode": "^1.5.4"
  },
  "devDependencies": {
    "nodemon": "^3.1.14"
  }
}
```

---

## 📬 Contacto

Para dudas o mejoras, me podes enviar un mail a moliaaaj@gmail.com.


[Ngrok Official Website](https://ngrok.com?utm_source=chatgpt.com)

Ejecutar:

```bash
ngrok http 3000
```

Actualizar `.env`:

```env
BASE_URL=https://xxxxx.ngrok-free.app
FRONT_URL=https://xxxxx.ngrok-free.app
```

---

# 📧 GMAIL APP PASSWORD

Para envío de emails:

## Activar:
- Verificación en dos pasos

## Generar:
- App Password

Usar esa password en:

```env
EMAIL_PASS=
```

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

- ID único
- Estado usado/no usado

El scanner marca:

```txt
Ticket válido
```

o

```txt
Ticket ya usado
```

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

```bash
CTRL + C
npm run dev
```

## Ver logs Mongo

```bash
mongosh
```

## Probar API

```bash
http://localhost:3000/eventos
```

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
