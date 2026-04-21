# Copilot instructions for nexo-backend

Purpose: Help future Copilot sessions understand how to build, run and navigate this repository.


Build, run, test, lint

- Install dependencies: npm ci  (or `npm install`)
- Start (production): npm run start  -> runs `node server.js`
- Start (dev): npm run dev  -> runs `node server.js` (no specialized dev script)
- Tests: No test script or test framework is present in package.json. There is no test runner configured; to run a single test after adding a test framework, add a `test` script and run `npm test -- <test-file-or-pattern>`.
- Lint: No linter configured in this project.


High-level architecture (big picture)

- Entry: server.js
  - Loads environment via dotenv
  - Sets up Express, CORS, JSON body parsing
  - Registers routes: /api (ordenes) and /mp (MercadoPago webhooks)
  - Connects to MongoDB via config/db.js

- config/
  - db.js: Mongoose connection, connection event handlers, connection options
  - mp.js: MercadoPago client wrapper (exports `preferenceClient`)

- models/
  - Evento: eventos con `entradas` subdocuments (tipo, precio, stock). Defines useful indexes (fecha, estado).
  - Orden: cliente, items, total, estado, mp_payment_id. Indexed fields for queries.
  - Ticket: links to orden+evento, unique qr_code, usado flag.

- controllers/
  - orden.controller.js: crearOrden (validates items, decrements stock, creates Orden, creates MercadoPago preference with external_reference = orden._id), mpWebhook (marks orden pagado, generates tickets).

- routes/
  - orden.routes.js: POST /api/comprar -> crearOrden
  - mp.routes.js: POST /mp/webhook -> webhook handler

- utils/
  - generarQR.js: generates a unique hex token for tickets using crypto.randomBytes

Payment flow summary

1. Client POSTs to /api/comprar with evento_id, items and cliente
2. Server validates stock, decrements stock locally, saves Evento, creates Orden document
3. Server uses `preferenceClient` to create a MercadoPago preference; sets back_urls using FRONT_URL env var and external_reference = orden._id
4. Client completes payment on MercadoPago
5. MercadoPago calls webhook (/mp/webhook or controller webhook handler) -> server marks orden as pagado and creates Ticket documents with unique qr_code

Key conventions and repository-specific notes

- Module type: ES modules (package.json: "type": "module"). Use `import`/`export`.
- dotenv usage: dotenv.config() is called in server.js and config/mp.js – ensure env vars are available before using config exports.
- Environment variables required at runtime:
  - MONGO_URI (required)
  - MERCADOPAGO_ACCESS_TOKEN (required)
  - FRONT_URL (used to build back_urls)
  - PORT (optional, defaults to 3000)
- Mongoose schemas use timestamps and explicit indexes — preserve these when changing schemas.
- Validation: models include schema-level validation (minlength, match, custom validators). Controllers also perform basic business validation and return HTTP 4xx/5xx statuses.
- MercadoPago integration:
  - Use config/mp.js `preferenceClient` for preference creation.
  - The code uses `external_reference` to correlate payments to orders (stringified order._id).
- QR codes: generated with crypto.randomBytes(16) and stored in Ticket.qr_code which has a unique DB index.
- Routes/Controllers organization: add new routes in routes/ and implement logic in controllers/ per existing pattern.

Files checked for integration docs

- No README.md / CONTRIBUTING.md inside this backend project to incorporate. No CLAUDE.md, .cursorrules, AGENTS.md, or similar AI assistant configs found in the project directory.


If anything above is incorrect or you want coverage for other areas (tests, CI, deployment), say which area to add and Copilot will extend this file.
