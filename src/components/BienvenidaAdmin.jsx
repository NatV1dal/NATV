
import { Link, useLocation } from 'react-router-dom'
import { FaUser } from 'react-icons/fa6'
import { useAuth } from '../context/AuthContext'

// ==================================
// DESCRIPCIONES SEGÚN LA VISTA
// ==================================

const descripciones = {
  '/admin':
    'Administra las solicitudes, cotizaciones y servicios desde tu panel NATV.',

  '/admin/solicitudes':
    'Revisa y gestiona las solicitudes recibidas de tus clientes.',

  '/admin/cotizaciones':
    'Consulta y prepara cotizaciones para las solicitudes de tus clientes.',

  '/admin/procesos':
    'Supervisa el avance de los servicios que se encuentran en desarrollo.',

  '/admin/finalizados':
    'Consulta y revisa los servicios que ya han sido finalizados.',

  '/admin/agregar-servicio':
    'Agrega y administra los servicios disponibles en la plataforma NATV.'
}

// ==================================
// COMPONENTE: BIENVENIDA ADMIN
// ==================================

function BienvenidaAdmin() {

  // ==================================
  // USUARIO AUTENTICADO
  // ==================================

  const { usuario } = useAuth()

  // ==================================
  // RUTA ACTUAL
  // ==================================

  const location = useLocation()
  const rutaActual = location.pathname

  // ==================================
  // NOMBRE DEL ADMINISTRADOR
  // ==================================

  const nombre = usuario?.nombre || 'Usuario'

  // ==================================
  // DESCRIPCIÓN AUTOMÁTICA
  // ==================================

  const descripcion =
    descripciones[rutaActual] ||
    (
      rutaActual.startsWith('/admin/cotizaciones/')
        ? 'Revisa los detalles y prepara la cotización de esta solicitud.'
        : 'Gestiona la información desde tu panel de administración NATV.'
    )

  // ==================================
  // ENCABEZADO COMPARTIDO
  // ==================================

  return (

    <section className="perfil-bienvenida">

      {/* SALUDO Y DESCRIPCIÓN */}

      <div className="perfil-bienvenida-texto">

        <h1>¡Hola, {nombre}!</h1>

        <p>{descripcion}</p>

      </div>

      {/* AVATAR */}

      <div className="perfil-avatar-marco">

        <div className="perfil-avatar">

          <FaUser
            aria-label="Avatar predeterminado"
          />

        </div>

      </div>

      {/* EDITAR DATOS */}

      <Link
        to="/perfil/editar"
        state={{ desdeAdmin: true }}
        className="perfil-editar-boton"
      >
        Editar datos
      </Link>

    </section>
  )
}

export default BienvenidaAdmin
