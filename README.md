# NATV.CL — Ideas que funcionan

**Proyecto Final | Desarrollo de Aplicaciones Full Stack JavaScript — Desafío Latam**

## Descripción

NATV.CL es una plataforma web para presentar y gestionar servicios digitales y creativos, como desarrollo web, diseño gráfico, branding, ilustración, fotografía y producción audiovisual.

Este repositorio corresponde al **Hito 2 — Desarrollo Frontend**, desarrollado con React.

## Tecnologías utilizadas

- **Frontend:** React, Vite, JavaScript, Bootstrap, CSS3 y React Icons.
- **Navegación:** React Router DOM.
- **Estados:** React Hooks y Context API.
- **Control de versiones y despliegue:** Git, GitHub y Vercel.

## Funcionalidades implementadas

- **Sitio público:** navegación por categorías, catálogo, detalle de servicios y formularios de solicitud.
- **Perfil cliente:** visualización de solicitudes, seguimiento de estados y favoritos de demostración.
- **Panel administrador:** gestión de solicitudes, cotizaciones y estados de servicios.
- **Gestión de servicios:** creación, búsqueda, edición, eliminación y previsualización dinámica.
- **Estado global:** Context API y almacenamiento local mediante `localStorage`.
- **Diseño responsive:** adaptación a distintos dispositivos.

## Instalación

**Requisitos:** Node.js, npm y Git.

Clonar el repositorio:

```bash
git clone https://github.com/NatV1dal/NATV.git
cd NATV
```

Instalar dependencias e iniciar el proyecto:

```bash
npm install
npm run dev
```

Generar y previsualizar la versión de producción:

```bash
npm run build
npm run preview
```

## Enlaces del proyecto

**Repositorio GitHub:**  
https://github.com/NatV1dal/NATV

**Sitio web en Vercel:**  
https://natv-zeta.vercel.app

## Accesos de demostración

Para facilitar la evaluación del frontend, las siguientes vistas están disponibles mediante enlaces directos:

| Vista | Enlace |
|---|---|
| Perfil cliente | https://natv-zeta.vercel.app/perfil |
| Perfil administrador | https://natv-zeta.vercel.app/admin |
| Gestión de servicios | https://natv-zeta.vercel.app/admin/agregar-servicio |

**Nota:** El inicio de sesión, registro y recuperación de contraseña cuentan con interfaces de frontend, pero la autenticación real se implementará en etapas posteriores.

Los datos son demostrativos y los cambios realizados mediante `localStorage` se conservan únicamente en el navegador utilizado.

## Próximas etapas

Implementación del backend con Node.js y Express, integración de PostgreSQL, conexión mediante API REST y autenticación de usuarios.

## Autora

**Natalie Vidal Aldea**  
NATV — Ideas que funcionan.