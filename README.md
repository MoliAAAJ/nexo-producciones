# 🎭 NEXO Producciones

Plataforma web para gestión y venta de entradas de eventos artísticos y culturales.

🌐 Sitio oficial: https://nexoesquel.com
🔌 API: https://api.nexoesquel.com

---

## 🚀 Descripción

NEXO Producciones es una aplicación web que permite:

* Visualizar eventos en tiempo real
* Gestionar entradas y precios dinámicamente
* Realizar compras online
* Preparar integración con pagos (MercadoPago)
* Escalar hacia un sistema completo de ticketing con QR y envío por email

---

## 🧱 Arquitectura

```txt
Frontend (https://nexoesquel.com)
        ↓
Backend API (https://api.nexoesquel.com)
        ↓
Base de datos (MongoDB Atlas)
```

---

## 📁 Estructura del proyecto

```txt
nexo-producciones/
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   └── imagenes/
│
├── backend/
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── Evento.js
│   │   ├── Orden.js
│   │   └── Ticket.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## ⚙️ Tecnologías utilizadas

### Frontend

* HTML5
* TailwindCSS
* JavaScript (Vanilla)

### Backend

* Node.js
* Express
* MongoDB (Mongoose)
* CORS
* dotenv

### Base de datos

* MongoDB Atlas

---

## 🔧 Instalación y ejecución (local)

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/nexo-producciones.git
cd nexo-producciones
```

---

### 2. Backend

```bash
cd backend
npm install
```

Crear archivo `.env`:

```env
PORT=3000
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/nexo_db?retryWrites=true&w=majority
```

Ejecutar:

```bash
npm run dev
```

Servidor disponible en:

```
http://localhost:3000
```

---

### 3. Frontend

Ejecutar servidor local:

```bash
npx serve frontend
```

O usar Live Server en VS Code.

---

## 🌐 API

### Obtener eventos

```
GET /eventos
```

Ejemplo:

```json
[
  {
    "_id": "...",
    "nombre": "Festival NEXO",
    "descripcion": "Una noche de música en vivo",
    "fecha": "2026-05-11",
    "lugar": "Esquel",
    "entradas": [
      {
        "tipo": "General",
        "precio": 5000
      }
    ]
  }
]
```

---

## 🧪 Estado actual del proyecto

✔ Frontend dinámico conectado al backend
✔ Backend funcional desplegable
✔ Conexión a MongoDB Atlas
✔ API REST operativa

---

## 🔜 Próximas funcionalidades

* [ ] Página de detalle de evento
* [ ] Flujo completo de compra (checkout)
* [ ] Integración con MercadoPago
* [ ] Generación de QR por entrada
* [ ] Envío de comprobantes por email
* [ ] Panel de administración

---

## 🌍 Deploy

### Frontend

* GitHub Pages conectado a:
  https://nexoesquel.com

### Backend

* Render / Railway
* Subdominio:
  https://api.nexoesquel.com

### Base de datos

* MongoDB Atlas

---

## 🔐 Seguridad

* Uso de variables de entorno (`.env`)
* No exponer credenciales en el repositorio
* Configuración de acceso en MongoDB Atlas
* Uso de HTTPS en producción

---

## 👨‍💻 Autor

Proyecto desarrollado para NEXO Producciones.

---

## 📄 Licencia

Uso interno / privado.
