# NEXOPass

Sistema de venta de entradas y acreditación para eventos culturales de NEXO Producciones.

El proyecto incluye un frontend estático, una API REST con Express y MongoDB, integración con MercadoPago Checkout PRO, generación de tickets con QR y envío de PDFs por correo electrónico.

## Funcionalidades

- Catálogo de eventos y detalle de entradas.
- Compra de entradas con descuento mediante cupones.
- Creación de preferencias de MercadoPago.
- Confirmación de pagos mediante webhook.
- Descuento de stock y creación de tickets después del pago aprobado.
- Tickets individuales en PDF con código QR.
- Envío de tickets por correo electrónico.
- Panel de administración con métricas y reportes.
- Validación de tickets desde el scanner.
- Listado PDF de compradores por evento.

## Tecnologías

- Frontend: HTML5, CSS3 y JavaScript vanilla.
- Backend: Node.js y Express.
- Base de datos: MongoDB con Mongoose.
- Pagos: MercadoPago SDK.
- PDF y QR: PDFKit y QRCode.
- Email: Nodemailer.
- Seguridad base: CORS y Helmet.

## Requisitos

- Node.js 18 o superior.
- npm.
- Una instancia de MongoDB local o MongoDB Atlas.
- Una cuenta de MercadoPago con access token.
- Una cuenta de correo compatible con SMTP, como Gmail con contraseña de aplicación.
- Un dominio público o túnel HTTPS para recibir el webhook de MercadoPago.

## Instalación

1. Cloná el repositorio e ingresá al backend:

```bash
git clone <URL_DEL_REPOSITORIO>
cd nexo-producciones/backend
```

2. Instalá las dependencias:

```bash
npm install
```

3. Creá `backend/.env` con la configuración del entorno:

```dotenv
PORT=3000
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/nexo

BASE_URL=http://localhost:3000
FRONT_URL=http://localhost:3000

MERCADOPAGO_ACCESS_TOKEN=TEST-XXXXXXXX

EMAIL_USER=tucorreo@gmail.com
EMAIL_PASS=xxxxxxxx

ADMIN_USER=admin
ADMIN_PASS=una-clave-segura
```

### Variables

| Variable | Uso |
| --- | --- |
| `PORT` | Puerto HTTP del servidor. Predeterminado: `3000`. |
| `MONGO_URI` | Cadena de conexión a MongoDB. |
| `BASE_URL` | URL pública del backend usada en webhook y enlaces de PDF. |
| `FRONT_URL` | URL pública del frontend y retorno de MercadoPago. |
| `MERCADOPAGO_ACCESS_TOKEN` | Access token de MercadoPago. |
| `EMAIL_USER` | Usuario remitente utilizado por Nodemailer. |
| `EMAIL_PASS` | Contraseña o contraseña de aplicación del remitente. |
| `ADMIN_USER` | Usuario del panel administrativo. |
| `ADMIN_PASS` | Contraseña del panel administrativo. |

> No subas `backend/.env` al repositorio. El archivo ya está excluido por `.gitignore`.

## Ejecutar localmente

Desde `backend`:

```bash
npm run dev
```

Para iniciar sin nodemon:

```bash
npm start
```

El servidor escucha en `http://localhost:3000` por defecto y sirve el frontend desde `backend/frontend`.

## Pruebas

Las pruebas utilizan el runner integrado de Node.js:

```bash
cd backend
node --test
```

## Estructura

```text
nexo-producciones/
├── backend/
│   ├── assets/
│   ├── config/
│   │   ├── db.js
│   │   └── mp.js
│   ├── controllers/
│   │   └── orden.controller.js
│   ├── frontend/
│   │   ├── admin/
│   │   ├── js/
│   │   ├── pages/
│   │   ├── payments/
│   │   ├── public/
│   │   └── styles/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Cupon.js
│   │   ├── Evento.js
│   │   ├── Orden.js
│   │   └── Ticket.js
│   ├── routes/
│   │   ├── admin.routes.js
│   │   ├── auth.routes.js
│   │   ├── mp.routes.js
│   │   ├── orden.routes.js
│   │   ├── reportes.routes.js
│   │   └── ticket.routes.js
│   ├── tests/
│   ├── utils/
│   ├── package.json
│   └── server.js
├── .gitignore
└── README.md
```

## Páginas principales

| Página | Ruta |
| --- | --- |
| Inicio | `/pages/index.html` |
| Detalle de evento | `/pages/evento.html?id=<id>` |
| Checkout | `/pages/checkout.html` |
| Pago exitoso | `/pages/success.html` |
| Pago pendiente | `/payments/pending.html` |
| Pago fallido | `/payments/fail.html` |
| Panel administrativo | `/admin/admin.html` |
| Scanner | `/payments/scanner.html` |

## API

### Eventos

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/api/eventos` | Lista todos los eventos. |
| `GET` | `/api/eventos/:id` | Obtiene un evento por ID. |

### Compras

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/api/orden` | Crea una orden y una preferencia de MercadoPago. |
| `GET` | `/api/orden/cupon/:codigo` | Valida un cupón activo. |
| `GET` | `/api/orden/:id` | Obtiene una orden. |
| `GET` | `/api/orden/ticket/:id/pdf` | Descarga el PDF de un ticket. |

### MercadoPago

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/mp/webhook` | Recibe notificaciones de pagos y genera los tickets. |

### Tickets

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/api/ticket/validar` | Valida o marca un ticket como usado. |
| `GET` | `/api/ticket/:id/pdf` | Descarga el PDF de un ticket. |

### Administración

Las rutas administrativas requieren autenticación HTTP Basic con `ADMIN_USER` y `ADMIN_PASS`.

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Valida las credenciales del administrador. |
| `GET` | `/api/admin/dashboard` | Obtiene métricas generales. |
| `GET` | `/api/admin/tickets?usados=false\|true` | Lista tickets, opcionalmente filtrados por uso. |
| `GET` | `/api/admin/eventos` | Obtiene estadísticas por evento. |
| `GET` | `/api/reportes/eventos/:id/pdf` | Descarga el reporte de compradores pagados de un evento. |

## Flujo de compra

1. El frontend consulta `/api/eventos`.
2. El usuario selecciona entradas y completa los datos.
3. `POST /api/orden` valida stock y cupones, crea la orden y genera la preferencia de MercadoPago.
4. El usuario completa el pago en MercadoPago.
5. MercadoPago envía una notificación a `/mp/webhook`.
6. El backend verifica el pago, cambia la orden a `pagado`, descuenta stock y genera los tickets.
7. Se crea el PDF de cada ticket y se envía por correo electrónico.

Las órdenes permanecen en estado `pendiente` hasta que el webhook recibe un pago aprobado. El procesamiento verifica pagos duplicados y evita generar tickets dos veces.

## Validación de tickets

El scanner puede enviar `{ "ticketId": "<id>" }` a `POST /api/ticket/validar`.

Respuestas esperadas:

- Ticket válido: se marca como usado y devuelve los datos del evento y del cliente.
- Ticket ya utilizado: devuelve un mensaje de rechazo.
- ID inexistente: devuelve que el ticket no es válido.

## Panel administrativo

El panel está disponible en `/admin/admin.html`.

Permite:

- Consultar órdenes, tickets e ingresos.
- Filtrar tickets usados y no usados.
- Revisar estadísticas por evento.
- Descargar el listado PDF de compradores pagados.
- Abrir el scanner para acreditar tickets.

## Webhook de MercadoPago

Para desarrollo local, configurá `BASE_URL` y `FRONT_URL` con una URL HTTPS pública, por ejemplo mediante ngrok:

```bash
ngrok http 3000
```

Actualizá las variables con el dominio generado y reiniciá el servidor:

```dotenv
BASE_URL=https://xxxx.ngrok-free.app
FRONT_URL=https://xxxx.ngrok-free.app
```

Configurá en MercadoPago una notification URL apuntando a:

```text
https://<dominio-publico>/mp/webhook
```

## Gmail

Para enviar correos con Gmail:

1. Activá la verificación en dos pasos.
2. Generá una contraseña de aplicación.
3. Usá esa contraseña como `EMAIL_PASS`.

No uses la contraseña normal de la cuenta.

## Modelos principales

### Cupón

- `codigo`: texto único en mayúsculas.
- `porcentaje`: porcentaje de descuento.
- `activo`: indica si puede utilizarse.

### Evento

- `nombre`, `descripcion`, `fecha`, `lugar`, `direccion`, `localidad` e `imagen`.
- `estado`: `activo`, `agotado` o `finalizado`.
- `entradas`: tipos de entrada con `tipo`, `precio` y `stock`.

### Orden

- `evento_id`, `cliente`, `items`, `total`, `descuento` y `codigo_descuento`.
- `estado`: `pendiente` o `pagado`.
- Datos opcionales de MercadoPago: `mp_payment_id` y `mp_status`.

### Ticket

- `orden_id` y `evento_id`.
- `tipo`, `qr_code` y `usado`.

## Notas técnicas

- El frontend es estático y se sirve desde Express.
- `FRONT_URL` también controla los orígenes permitidos por CORS.
- Los reportes PDF usan el logo ubicado en `backend/assets/logo.png`.
- Los cambios de stock se realizan al confirmar el pago aprobado.
- El proyecto usa Tailwind mediante CDN en las páginas que lo incluyen.

## Despliegue

Al desplegar en producción:

- Configurá todas las variables de entorno en la plataforma.
- Usá MongoDB Atlas o una instancia administrada.
- Usá una URL HTTPS real para `BASE_URL` y `FRONT_URL`.
- Reemplazá el access token de pruebas por las credenciales de producción.
- Configurá el webhook público de MercadoPago.
- Usá un gestor de procesos o el servicio de ejecución recomendado por el proveedor.

## Autor

José Luis Moliterno

NEXO Producciones
