# 🎟️ NEXO Producciones

Sistema de venta de entradas online con:

- MercadoPago Checkout PRO
- Generación automática de tickets QR
- PDFs descargables
- Envío de tickets por email
- Listado PDF de compradores
- Frontend HTML + Tailwind
- Backend Node.js + Express + MongoDB

---

# 🚀 STACK

## Frontend
- HTML5
- CSS3
- JavaScript Vanilla
- TailwindCSS CDN

## Backend
- Node.js
- Express
- MongoDB + Mongoose

## Integraciones
- MercadoPago SDK
- Nodemailer
- QRCode
- PDFKit

---

# 📦 DEPENDENCIAS

## Backend

Instalar dentro de:

```bash
/backend
```

### Dependencias principales

```bash
npm install express mongoose cors dotenv mercadopago qrcode pdfkit nodemailer
```

### Dependencias dev

```bash
npm install -D nodemon
```

---

# 📂 ESTRUCTURA

```txt
nexo-producciones/
│
├── frontend/
│   ├── index.html
│   ├── evento.html
│   ├── checkout.html
│   ├── success.html
│   ├── pending.html
│   ├── fail.html
│   ├── scanner.html
│   ├── script.js
│   ├── style.css
│   └── imagenes/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── assets/
│   │   └── nexo_logo_transparente.png
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

# ⚙️ VARIABLES DE ENTORNO

Crear:

```bash
/backend/.env
```

Contenido:

```env
PORT=3000

MONGO_URI=mongodb://127.0.0.1:27017/nexo

BASE_URL=http://localhost:3000
FRONT_URL=http://localhost:3000

MERCADOPAGO_ACCESS_TOKEN=TEST-XXXXXXXX

EMAIL_USER=tucorreo@gmail.com
EMAIL_PASS=xxxxxxxx
```

---

# 🟢 MONGODB

Instalar MongoDB Community Edition.

## Linux

```bash
sudo systemctl start mongod
```

Verificar:

```bash
mongosh
```

---

# ▶️ EJECUTAR BACKEND

Dentro de:

```bash
/backend
```

## Desarrollo

```bash
npm run dev
```

## Producción

```bash
npm start
```

---

# 📜 package.json

```json
{
  "name": "nexo-backend",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  }
}
```

---

# 💳 MERCADOPAGO

## Credenciales

Obtener desde:

[Mercado Pago Developers](https://www.mercadopago.com.ar/developers/panel?utm_source=chatgpt.com)

Usar:

- ACCESS TOKEN TEST
- Luego producción

---

# 🌐 WEBHOOKS EN LOCALHOST

MercadoPago NO puede acceder a localhost.

Necesitás usar:

## NGROK

Instalar:

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

Proyecto desarrollado para:

## NEXO Producciones

Sistema de tickets y eventos culturales.
