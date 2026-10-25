
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaUser } from 'react-icons/fa6'

import {
  SeccionAdmin,
  solicitudesIniciales
} from './PerfilAdmin'

import './PerfilCliente.css'
import './PerfilAdmin.css'

function SolicitudesAdmin() {

  const [solicitudes, setSolicitudes] = useState(
    solicitudesIniciales.filter(
      (solicitud) => solicitud.grupo === 'recibidas'
    )
  )

  // Cambiar estado de una solicitud
  function cambiarEstado(id, nuevoEstado) {

    setSolicitudes((anteriores) =>
      anteriores.map((solicitud) =>
        solicitud.id === id
          ? { ...solicitud, estado: nuevoEstado }
          : solicitud
      )
    )

  }

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
              Administra las solicitudes recibidas
              y revisa los requerimientos
              de tus clientes.
            </p>

          </div>

          {/* Avatar */}
          <div className="perfil-avatar-marco">

            <div className="perfil-avatar">
              <FaUser aria-label="Avatar predeterminado" />
            </div>

          </div>

          {/* Editar datos */}
          <Link
            to="/perfil/editar"
            className="perfil-editar-boton"
          >
            Editar datos
          </Link>

        </section>

        {/* ==================================
            SOLICITUDES RECIBIDAS
        ================================== */}

        <SeccionAdmin
          id="solicitudes-recibidas"
          titulo="Solicitudes recibidas"
          solicitudes={solicitudes}
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

export default SolicitudesAdmin
