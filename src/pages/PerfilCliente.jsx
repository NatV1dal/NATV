
import { Link, useNavigate } from 'react-router-dom'
import { FaUser, FaPenNib, FaVideo, FaHeart } from 'react-icons/fa6'
import { solicitudesDemo } from '../data/solicitudesDemo'
import { useEffect, useState } from 'react'
import BienvenidaCliente from '../components/BienvenidaCliente'

import './PerfilCliente.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'


const favoritosDemo = [
  {
    id: 1,
    nombre: 'Diseño de logotipo',
    descripcion:
      'Creación de logotipos personalizados que reflejan la identidad de tu marca.',
    categoria: 'diseno-grafico',
    color: 'var(--morado-natv)'
  },
  {
    id: 2,
    nombre: 'Desarrollo de sitio web',
    descripcion:
      'Diseño y desarrollo de sitios web modernos y adaptables a distintos dispositivos.',
    categoria: 'desarrollo-web',
    color: 'var(--celeste-natv)'
  }
]


// Datos de demostración.
// Posteriormente vendrán desde la API.



// Ícono según la categoría
function IconoServicio({ categoria }) {
  if (categoria === 'audiovisual') {
    return <FaVideo aria-hidden="true" />
  }

  return <FaPenNib aria-hidden="true" />
}

// Tarjetas reutilizables
function TarjetaPerfil({ servicio, tipo }) {

   const navigate = useNavigate()

  const esSolicitud = tipo === 'solicitud'

  
function manejarAccion() {

  if (esSolicitud) {

    navigate(`/perfil/solicitudes/${servicio.id}`)

  } else {

    window.alert(
      'La solicitud de servicios estará disponible al conectar el backend.'
    )

  }

}


  return (
    <article
      className="perfil-tarjeta-servicio"
      style={{
        '--color-tarjeta': servicio.color
      }}
    >

      <div className="perfil-tarjeta-informacion">

        <div className="perfil-tarjeta-icono">
          <IconoServicio categoria={servicio.categoria} />
        </div>

        <div className="perfil-tarjeta-textos">

          <h3>{servicio.nombre}</h3>

          {esSolicitud && (
            <span className="perfil-numero-pedido">
              N.º Pedido: {servicio.numero}
            </span>
          )}

          <p>{servicio.descripcion}</p>

        </div>

        <FaHeart
          className="perfil-tarjeta-corazon"
          aria-hidden="true"
        />

      </div>

      <button
        type="button"
        className="perfil-tarjeta-boton"
        onClick={manejarAccion}
      >
        {esSolicitud
          ? 'Ver estado'
          : 'Solicitar servicio'}
      </button>

    </article>
  )
}

function PerfilCliente() {

const navigate = useNavigate()

  // ==================================
  // DATOS DEL CLIENTE AUTENTICADO
  // ==================================

  const [usuario, setUsuario] = useState(null)
  const [errorSesion, setErrorSesion] = useState('')

  useEffect(() => {
    const token = sessionStorage.getItem('natv_token')

    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    const controller = new AbortController()

    async function obtenerUsuario() {
      try {
        const respuesta = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          signal: controller.signal
        })

        if (respuesta.status === 401 || respuesta.status === 404) {
          sessionStorage.removeItem('natv_token')
          navigate('/login', { replace: true })
          return
        }

        if (!respuesta.ok) {
          throw new Error('No fue posible consultar la sesión.')
        }

        const datos = await respuesta.json()

        // Verificar que el usuario sea cliente
        if (datos.user?.rol !== 'cliente') {
          if (datos.user?.rol === 'administrador') {
            navigate('/admin', { replace: true })
          } else {
            setErrorSesion('No tienes permisos para acceder a este perfil.')
          }
          return
        }

        setUsuario(datos.user)

      } catch (error) {
        if (error.name !== 'AbortError') {
          setErrorSesion(
            'No fue posible cargar tus datos. Recarga la página.'
          )
        }
      }
    }

    obtenerUsuario()

    return () => controller.abort()

  }, [navigate])


  function editarDatos() {
  navigate('/perfil/editar')
}

  // ==================================
  // VERIFICAR LA SESIÓN
  // ==================================

  if (errorSesion) {
    return (
      <main className="perfil-pagina" role="alert">
        {errorSesion}
      </main>
    )
  }

  if (!usuario) {
    return (
      <main className="perfil-pagina">
        Verificando sesión...
      </main>
    )
  }

  return (
    <main className="perfil-pagina">

      <div className="perfil-contenedor">

        <BienvenidaCliente />

        {/* ==================================
            SOLICITUDES
        ================================== */}

        <section
          className="perfil-seccion"
          id="solicitudes"
        >

          <h2>Solicitudes</h2>

          <div className="perfil-tarjetas-grid">

            {solicitudesDemo.map((solicitud) => (

              <TarjetaPerfil
                key={solicitud.id}
                servicio={solicitud}
                tipo="solicitud"
              />

            ))}

          </div>

        </section>

        {/* ==================================
            FAVORITOS
        ================================== */}

        <section
          className="perfil-seccion"
          id="favoritos"
        >

          <h2>Mis favoritos</h2>

          <div className="perfil-tarjetas-grid">

            {favoritosDemo.map((favorito) => (

              <TarjetaPerfil
                key={favorito.id}
                servicio={favorito}
                tipo="favorito"
              />

            ))}

          </div>

          <div className="perfil-mas-servicios">

            <Link
              to="/#servicios"
              className="perfil-ver-mas"
            >
              Ver más servicios
            </Link>

          </div>

        </section>

        {/* ==================================
            DECORACIÓN INFERIOR
        ================================== */}

        <div
          className="perfil-puntos"
          aria-hidden="true"
        />

      </div>

    </main>
  )
}

export default PerfilCliente
