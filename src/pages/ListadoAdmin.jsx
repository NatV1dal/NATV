
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaUser } from 'react-icons/fa6'

import {
  SeccionAdmin,
  solicitudesIniciales
} from './PerfilAdmin'

import './PerfilCliente.css'
import './PerfilAdmin.css'

// ==================================
// CONFIGURACIÓN DE LAS SECCIONES
// ==================================

const secciones = {
  solicitudes: {
    titulo: 'Solicitudes recibidas',
    grupo: 'recibidas'
  },

  cotizaciones: {
    titulo: 'Cotizaciones pendientes',
    grupo: 'cotizaciones'
  },

  procesos: {
    titulo: 'Servicios en proceso',
    grupo: 'proceso'
  }
}

// ==================================
// PÁGINA LISTADO ADMINISTRADOR
// ==================================

function ListadoAdmin() {

  const { seccion } = useParams()

  const configuracion = secciones[seccion]

  const [solicitudes, setSolicitudes] = useState(
    solicitudesIniciales
  )

  // Cambiar estado de la solicitud
  function cambiarEstado(id, nuevoEstado) {

    setSolicitudes((anteriores) =>
      anteriores.map((solicitud) =>
        solicitud.id === id
          ? { ...solicitud, estado: nuevoEstado }
          : solicitud
      )
    )

  }

  // Sección no encontrada
  if (!configuracion) {
    return (
      <main className="perfil-pagina">
        <div className="perfil-contenedor">

          <h1>Sección no encontrada</h1>

          <Link to="/admin">
            Volver al administrador
          </Link>

        </div>
      </main>
    )
  }

  // Filtrar solicitudes según la sección
  const solicitudesFiltradas = solicitudes.filter(
    (solicitud) =>
      solicitud.grupo === configuracion.grupo
  )

  return (
    <main className="perfil-pagina admin-pagina">

      <div className="perfil-contenedor">

        {/* ==================================
            BIENVENIDA
        ================================== */}

        <section className="perfil-bienvenida">

          <div className="perfil-bienvenida-texto">

            <h1>¡Hola, Natalie!</h1>

            <p>
              Administra las solicitudes,
              cotizaciones y servicios
              desde tu panel NATV.
            </p>

          </div>

          <div className="perfil-avatar-marco">

            <div className="perfil-avatar">
              <FaUser aria-label="Avatar predeterminado" />
            </div>

          </div>

          <Link
            to="/perfil/editar"
            className="perfil-editar-boton"
          >
            Editar datos
          </Link>

        </section>

        {/* ==================================
            LISTADO DE LA SECCIÓN
        ================================== */}

        <SeccionAdmin
          id={seccion}
          titulo={configuracion.titulo}
          solicitudes={solicitudesFiltradas}
          cambiarEstado={cambiarEstado}
        />

        {/* ==================================
            PUNTOS DECORATIVOS
        ================================== */}

        <div
          className="perfil-puntos"
          aria-hidden="true"
        />

      </div>

    </main>
  )
}

export default ListadoAdmin
