
import { Link, useLocation } from 'react-router-dom'
import { FaUser } from 'react-icons/fa6'
import { useAuth } from '../context/AuthContext'

// ==================================
// COMPONENTE: BIENVENIDA CLIENTE
// ==================================

function BienvenidaCliente() {

  // ==================================
  // USUARIO AUTENTICADO
  // ==================================

  const { usuario } = useAuth()

  // ==================================
  // RUTA ACTUAL
  // ==================================

  const location = useLocation()

  const rutaActual = location.pathname
  const hashActual = location.hash

  // ==================================
  // NOMBRE DEL CLIENTE
  // ==================================

  const nombre = usuario?.nombre || 'Usuario'

  // ==================================
  // DESCRIPCIÓN SEGÚN LA VISTA
  // ==================================

  let descripcion =
    'Bienvenido a tu espacio. Aquí podrás administrar tus solicitudes, servicios favoritos y datos personales.'

  if (rutaActual.startsWith('/perfil/solicitudes/')) {

    descripcion =
      'Consulta el estado y seguimiento de tu solicitud.'

  } else if (rutaActual === '/perfil') {

    if (hashActual === '#solicitudes') {

      descripcion =
        'Bienvenido a tu espacio. Aquí podrás administrar tus solicitudes, servicios favoritos y datos personales.'

    } else if (hashActual === '#favoritos') {

      descripcion =
        'Encuentra los servicios que guardaste como favoritos.'

    }

  }

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
        className="perfil-editar-boton"
      >
        Editar datos
      </Link>

    </section>
  )
}

export default BienvenidaCliente
