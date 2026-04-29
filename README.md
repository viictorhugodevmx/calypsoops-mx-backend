# CalypsoOps MX Backend

Backend lab para simular una capa operativa alrededor de Calypso en contexto de Mercado de Dinero / Mercado de Deuda gubernamental mexicana.

## Objetivo

Simular APIs que podrían ser consumidas por un frontend Angular para consultar información relacionada con:

- Instrumentos de deuda mexicana
- Operaciones de mercado
- Conciliación INDEVAL
- Riesgos y límites
- Logs de cumplimiento
- Reportes operativos

## Contexto del lab

Este proyecto no consume Calypso real.

La idea es simular una arquitectura parecida a la que podría existir en un banco:

```txt
Calypso / Proveedor / Middleware
        ↓
Backend API
        ↓
Angular Frontend
        ↓
Pantallas operativas
```

## Stack

- Node.js 20.19.4
- TypeScript 5.9.x
- Express
- MongoDB 6.0.20
- Mongoose
- Postman

## Estructura inicial

```txt
backend/
  postman/
  src/
    app.ts
    server.ts
    config/
    modules/
    seed/
    shared/
```

## Scripts

```bash
npm run dev
npm run build
npm start
npm run seed
```

## Variables de entorno

Crear archivo `.env` con base en `.env.example`:

```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/calypsoops_mx
NODE_ENV=development
```

## Health Check

En el siguiente paso se habilitará:

```http
GET /api/health
```

## Módulos planeados

### MVP

- Health
- Instruments
- Trades
- Reconciliation INDEVAL
- Risk Limits
- Compliance Logs

### Fase posterior

- Workbench
- Accounting
- Regulatory Reports
- End of Day Position Report


## Paso 1 - Health Check

Endpoint disponible:

```http
GET /api/health
```

Respuesta esperada:

```json
{
  "success": true,
  "service": "CalypsoOps MX Backend",
  "environment": "development",
  "database": {
    "status": "connected"
  }
}
```

## Postman

Colección sugerida:

```txt
CalypsoOps MX API
```

Folder:

```txt
Health
```

Request:

```txt
GET Health Check
```

## Paso 2 - Instruments

Módulo para simular instrumentos de deuda mexicana usados en Mercado de Dinero / Mercado de Deuda.

### Endpoints

```http
POST /api/instruments/seed/run
GET /api/instruments
GET /api/instruments/:id
```

### Filtros disponibles

```http
GET /api/instruments?type=CETES
GET /api/instruments?status=ACTIVE
GET /api/instruments?search=bono
```

### Instrumentos simulados

- CETES
- BONOS M
- UDIBONOS
- BONDES F
- BPAs

## Paso 3 - Trades

Módulo para simular operaciones financieras realizadas sobre instrumentos de deuda mexicana.

### Endpoints

```http
POST /api/trades/seed/run
GET /api/trades
GET /api/trades/:id
PATCH /api/trades/:id/status
```

### Filtros disponibles

```http
GET /api/trades?status=SETTLED
GET /api/trades?type=REPO
GET /api/trades?counterparty=Banco
GET /api/trades?search=Repo
```

### Tipos de operación simulados

- BUY
- SELL
- REPO
- REVERSE_REPO

### Estados simulados

- CAPTURED
- VALIDATED
- SETTLED
- REJECTED