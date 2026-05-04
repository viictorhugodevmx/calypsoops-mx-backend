# CalypsoOps MX Backend

Backend lab para simular una capa operativa alrededor de Calypso en contexto de Mercado de Dinero / Mercado de Deuda gubernamental mexicana.

## Objetivo

Simular APIs que podrían ser consumidas por un frontend Angular para consultar información relacionada con:

- Instrumentos de deuda mexicana
- Operaciones de mercado
- Conciliación INDEVAL
- Riesgos y límites
- Logs de cumplimiento
- Banco de trabajo operativo
- Reportes operativos/regulatorios
- Dashboard consolidado

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

## Estructura

```txt
backend/
  postman/
  src/
    app.ts
    server.ts
    config/
    modules/
      health/
      dashboard/
      instruments/
      trades/
      reconciliation/
      risk/
      compliance/
      workbench/
      reports/
    seed/
    shared/
```

## Instalación

```bash
npm install
```

## Variables de entorno

Crear archivo `.env` con base en `.env.example`:

```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/calypsoops_mx
NODE_ENV=development
```

## Scripts

```bash
npm run dev
npm run build
npm start
npm run seed
```

## Levantar MongoDB

```bash
sudo systemctl status mongod
sudo systemctl start mongod
```

## Seed global

```bash
npm run seed
```

Orden de ejecución:

```txt
1. Instruments
2. Trades
3. Reconciliation Positions
4. Risk Limits
5. Compliance Logs
6. Workbench Tasks
7. Reports
```

## Levantar servidor

```bash
npm run dev
```

API local:

```txt
http://localhost:4000
```

## Health Check

```http
GET /api/health
```

## Dashboard

```http
GET /api/dashboard/summary
```

## Instruments

```http
POST /api/instruments/seed/run
GET /api/instruments
GET /api/instruments?type=CETES
GET /api/instruments?status=ACTIVE
GET /api/instruments?search=bono
GET /api/instruments/:id
```

## Trades

```http
POST /api/trades/seed/run
GET /api/trades
GET /api/trades?status=SETTLED
GET /api/trades?type=REPO
GET /api/trades?counterparty=Banco
GET /api/trades?search=Repo
GET /api/trades/:id
PATCH /api/trades/:id/status
```

## Reconciliation INDEVAL

```http
POST /api/reconciliation/seed/run
GET /api/reconciliation/positions
GET /api/reconciliation/positions?source=CALYPSO
GET /api/reconciliation/positions?source=INDEVAL
POST /api/reconciliation/run
GET /api/reconciliation/runs
GET /api/reconciliation/runs/:id
PATCH /api/reconciliation/breaks/:id/review
```

## Risk Limits

```http
POST /api/risk/seed/run
GET /api/risk/limits
GET /api/risk/exposure
GET /api/risk/breaches
```

## Compliance Logs

```http
POST /api/compliance/seed/run
GET /api/compliance/logs
GET /api/compliance/logs?result=FAILED
GET /api/compliance/logs?severity=CRITICAL
GET /api/compliance/logs/:id
GET /api/compliance/rules
```

## Workbench

```http
POST /api/workbench/seed/run
GET /api/workbench/tasks
GET /api/workbench/tasks?status=OPEN
GET /api/workbench/tasks?priority=CRITICAL
GET /api/workbench/tasks/:id
PATCH /api/workbench/tasks/:id/status
POST /api/workbench/tasks/:id/comments
```

## Reports

```http
POST /api/reports/seed/run
POST /api/reports/generate
GET /api/reports/history
GET /api/reports/history?type=BANXICO_REPORT
GET /api/reports/:id
```

## Postman

Archivos esperados:

```txt
postman/
  CalypsoOps-MX-API.postman_collection.json
  CalypsoOps-MX-Local.postman_environment.json
```

Environment sugerido:

```txt
baseUrl = http://localhost:4000
```

## Concepto financiero del lab

Este backend simula una capa intermedia que podría recibir, procesar o exponer información relacionada con Calypso, INDEVAL, Banxico, Riesgos, Cumplimiento y Back Office.

En un escenario real:

```txt
Proveedor / Middleware integra datos financieros
Backend expone contratos
Frontend Angular consume APIs
Usuario operativo valida, consulta o gestiona información
```