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

## Paso 4 - Reconciliation INDEVAL

Módulo para simular conciliación entre posiciones registradas en Calypso y posiciones reportadas por INDEVAL.

### Endpoints

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

### Concepto

```txt
CALYPSO position - INDEVAL position = reconciliation difference
```

Si la diferencia es `0`, el resultado es:

```txt
MATCHED
```

Si existe diferencia:

```txt
BREAK
```

## Paso 5 - Risk Limits

Módulo para simular límites de riesgo sobre operaciones de mercado.

### Endpoints

```http
POST /api/risk/seed/run
GET /api/risk/limits
GET /api/risk/exposure
GET /api/risk/breaches
```

### Concepto

```txt
Exposición actual / Límite permitido = Porcentaje de uso
```

Estados:

```txt
OK
WARNING
BREACHED
```

### Tipos de límite

- INSTRUMENT
- INSTRUMENT_TYPE
- COUNTERPARTY
- DESK

## Paso 6 - Compliance Logs

Módulo para simular logs de reglas de cumplimiento aplicadas sobre trades.

### Endpoints

```http
POST /api/compliance/seed/run
GET /api/compliance/logs
GET /api/compliance/logs?result=FAILED
GET /api/compliance/logs?severity=CRITICAL
GET /api/compliance/logs/:id
GET /api/compliance/rules
```

### Concepto

```txt
Trade + Regla de cumplimiento = Compliance Log
```

### Resultados simulados

```txt
PASSED
WARNING
FAILED
```

### Severidades simuladas

```txt
LOW
MEDIUM
HIGH
CRITICAL
```

### Reglas simuladas

- NO_SHORT_SELL
- COUNTERPARTY_LIMIT
- VALUE_DATE_VALIDATION
- COLLATERAL_SUFFICIENCY
- EQUIVALENT_RATING

## Paso 7 - Workbench

Módulo para simular un banco de trabajo operativo.

### Endpoints

```http
POST /api/workbench/seed/run
GET /api/workbench/tasks
GET /api/workbench/tasks?status=OPEN
GET /api/workbench/tasks?priority=CRITICAL
GET /api/workbench/tasks/:id
PATCH /api/workbench/tasks/:id/status
POST /api/workbench/tasks/:id/comments
```

### Concepto

```txt
Evento operativo → Tarea → Revisión → Comentario → Resolución
```

### Tipos simulados

- RECONCILIATION_BREAK
- RISK_BREACH
- COMPLIANCE_FAILED
- REPORT_PENDING
- BACK_OFFICE_REVIEW

### Estados

- OPEN
- IN_PROGRESS
- RESOLVED
- CANCELLED

## Paso 8 - Reports

Módulo para simular generación e historial de reportes operativos/regulatorios.

### Endpoints

```http
POST /api/reports/seed/run
POST /api/reports/generate
GET /api/reports/history
GET /api/reports/history?type=BANXICO_REPORT
GET /api/reports/:id
```

### Tipos de reporte

```txt
BANXICO_REPORT
EOD_POSITION
INDEVAL_BREAKS
RISK_BREACHES
COMPLIANCE_LOGS
```

### Estados

```txt
PENDING
GENERATED
FAILED
```

### Concepto

```txt
Datos operativos + fecha de negocio + tipo de reporte = reporte generado
```