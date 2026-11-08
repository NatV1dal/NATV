
# NATV.CL — Backend

API REST desarrollada con Node.js, Express y PostgreSQL para una plataforma de servicios creativos.

## Tecnologías
- Node.js y Express
- PostgreSQL (pg)
- JWT y bcryptjs
- CORS y dotenv
- Jest y Supertest

## Instalación

Desde la carpeta `backend`:

```bash
npm install
```

## Base de datos

Crear la base de datos e importar los archivos SQL:

```bash
createdb natv_db
psql -d natv_db -f database/schema.sql
psql -d natv_db -f database/seeds.sql
psql -d natv_db -f database/servicios.sql
```

Ejecutar estos comandos en una base de datos nueva.

## Configuración

Crear un archivo `.env` con las variables:

```env
PORT=3000
PGHOST=/tmp
PGPORT=5432
PGDATABASE=natv_db
PGUSER=tu_usuario
JWT_SECRET=tu_clave_secreta
```

Agregar `PGPASSWORD` si corresponde. El archivo `.env` no debe subirse a GitHub.

## Ejecución

```bash
npm run dev
```

API disponible en `http://localhost:3000`.

## Funcionalidades

- Registro e inicio de sesión con JWT.
- Autorización por roles: cliente y administrador.
- Consulta y administración de servicios.
- Creación y seguimiento de solicitudes.
- Cotizaciones con versiones y publicación.

## Pruebas automatizadas

```bash
npm test
```

Se implementaron 10 pruebas con Jest y Supertest.

## Consideraciones

El backend funciona localmente. La conexión con React, la carga de archivos PDF y el envío de correos están pendientes.
