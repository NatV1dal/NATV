# NATV.CL — Ideas que funcionan

**Proyecto Final | Desarrollo de Aplicaciones Full Stack JavaScript — Desafío Latam**

## Descripción del proyecto

NATV.CL es una plataforma web orientada a la presentación y gestión de servicios digitales y creativos, integrando áreas como desarrollo web, diseño gráfico, branding, ilustración, fotografía y producción audiovisual.

La plataforma permite explorar categorías, consultar información detallada de los servicios y acceder a formularios de solicitud. También contempla vistas para clientes y un panel administrativo para gestionar servicios, solicitudes y cotizaciones.

Este repositorio corresponde al desarrollo del **Hito 2: Frontend con React**.

## Tecnologías utilizadas

- React
- Vite
- JavaScript
- React Router DOM
- React Hooks
- Context API
- Bootstrap
- CSS3
- React Icons
- Git y GitHub

## Funcionalidades implementadas

### Sitio web público

- Página de inicio de NATV.CL.
- Presentación de servicios por categorías.
- Tarjetas informativas de servicios.
- Vista de detalle de cada servicio.
- Formulario de solicitud de servicios.
- Navegación entre las distintas vistas.
- Diseño adaptable a dispositivos móviles.

### Perfil del cliente

- Vista de perfil.
- Edición de datos de demostración.
- Visualización de solicitudes.
- Seguimiento de estados de solicitudes.
- Sección de favoritos de demostración.

### Panel del administrador

- Visualización y gestión de solicitudes.
- Listado de cotizaciones.
- Seguimiento de servicios en proceso y finalizados.
- Filtros para consultar solicitudes.
- Creación de nuevos servicios.
- Búsqueda de servicios por nombre.
- Edición y eliminación de servicios.
- Previsualización dinámica antes de guardar.

### Gestión de datos

Se utiliza Context API para compartir información entre componentes y mantener sincronizadas las vistas.

La gestión de servicios utiliza `localStorage` para conservar los cambios realizados en el navegador.

## Instalación del proyecto

### Requisitos previos

- Node.js compatible con la versión de Vite del proyecto.
- npm.
- Git.
- Un editor de código, como Visual Studio Code.

### 1. Clonar el repositorio

Ejecutar en la terminal:

`git clone https://github.com/NatV1dal/NATV.git`

### 2. Acceder a la carpeta del proyecto

`cd NATV`

### 3. Instalar dependencias

`npm install`

### 4. Iniciar el servidor de desarrollo

`npm run dev`

Abrir en el navegador la dirección local indicada por Vite, habitualmente `http://localhost:5173/`.

### 5. Generar la versión de producción

`npm run build`

### 6. Previsualizar la versión de producción

`npm run preview`

## Despliegue

La aplicación frontend se publicará en Vercel, utilizando el repositorio de GitHub como fuente del proyecto.

**Repositorio:** https://github.com/NatV1dal/NATV

**Sitio web:** Pendiente de agregar después del despliegue en Vercel.

## Estado actual del desarrollo

**Hito 2 — Frontend con React.**

La versión actual presenta las interfaces y funcionalidades del frontend mediante datos de demostración y almacenamiento local.

La autenticación real, la conexión a la API REST y la persistencia de datos en PostgreSQL se incorporarán en etapas posteriores.

Los servicios creados o modificados mediante `localStorage` se conservan únicamente en el navegador donde se realizan los cambios.

## Próximas etapas

- Implementación del backend con Node.js y Express.
- Integración de PostgreSQL.
- Conexión del frontend con la API REST.
- Autenticación y autorización de usuarios.
- Persistencia de solicitudes, favoritos y servicios en la base de datos.

## Autora

**Natalie Vidal**

NATV — Ideas que funcionan.
