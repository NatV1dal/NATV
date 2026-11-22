
import { Link, useNavigate } from 'react-router-dom'
import { FaPenNib, FaVideo, FaHeart } from 'react-icons/fa6'
import { useEffect, useState } from 'react'

import BienvenidaCliente from '../components/BienvenidaCliente'

import './PerfilCliente.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// ==================================
// FAVORITOS DE DEMOSTRACIÓN
// ==================================

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

// ==================================
// ÍCONO SEGÚN LA CATEGORÍA
// ==================================

function IconoServicio({ categoria }) {

  if (categoria === 'audiovisual') {
    return <FaVideo aria-hidden="true" />
  }

  return <FaPenNib aria-hidden="true" />
}

// ==================================
// TARJETAS REUTILIZABLES
// ==================================

function TarjetaPerfil({ servicio, tipo }) {

  const esSolicitud = tipo === 'solicitud'
  const navigate = useNavigate()

  
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

          
            {esSolicitud && (
              <span className="perfil-numero-pedido">
                Estado:{' '}
                <span
                  style={{
                    color: servicio.colorEstado,
                    fontWeight: 700
                  }}
                >
                  {servicio.estado}
                </span>
              </span>
            )}


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

// ==================================
// PÁGINA PERFIL CLIENTE
// ==================================

function PerfilCliente() {

  const navigate = useNavigate()

  // ==================================
  // DATOS DEL CLIENTE AUTENTICADO
  // ==================================

  const [usuario, setUsuario] = useState(null)
  const [errorSesion, setErrorSesion] = useState('')

  // ==================================
  // SOLICITUDES REALES
  // ==================================

  const [solicitudes, setSolicitudes] = useState([])
  const [cargandoSolicitudes, setCargandoSolicitudes] = useState(true)
  const [errorSolicitudes, setErrorSolicitudes] = useState('')

  // ==================================
  // VERIFICAR SESIÓN DEL CLIENTE
  // ==================================

  useEffect(() => {

    const token = sessionStorage.getItem('natv_token')

    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    const controller = new AbortController()

    async function obtenerUsuario() {

      try {

        const respuesta = await fetch(
          `${API_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            signal: controller.signal
          }
        )

        if (
          respuesta.status === 401 ||
          respuesta.status === 404
        ) {

          sessionStorage.removeItem('natv_token')

          navigate('/login', { replace: true })
          return
        }

        if (!respuesta.ok) {
          throw new Error(
            'No fue posible consultar la sesión.'
          )
        }

        const datos = await respuesta.json()

        // ==================================
        // VERIFICAR EL ROL
        // ==================================

        if (datos.user?.rol !== 'cliente') {

          if (datos.user?.rol === 'administrador') {
            navigate('/admin', { replace: true })
          } else {
            setErrorSesion(
              'No tienes permisos para acceder a este perfil.'
            )
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

  // ==================================
  // OBTENER SOLICITUDES DEL CLIENTE
  // ==================================

  useEffect(() => {

    // Esperar a verificar la sesión
    if (!usuario) {
      return
    }

    const controller = new AbortController()

    async function obtenerSolicitudes() {

      setCargandoSolicitudes(true)
      setErrorSolicitudes('')

      try {

        const token = sessionStorage.getItem('natv_token')

        if (!token) {
          throw new Error(
            'No se encontró una sesión activa.'
          )
        }

        // ==================================
        // CONSULTAR NUESTRA API
        // ==================================

        const respuesta = await fetch(
          `${API_URL}/api/solicitudes/mis-solicitudes`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            },
            signal: controller.signal
          }
        )

        if (respuesta.status === 401) {
          throw new Error(
            'Tu sesión ha vencido. Vuelve a iniciar sesión.'
          )
        }

        if (!respuesta.ok) {
          throw new Error(
            'No fue posible obtener tus solicitudes.'
          )
        }

        const datos = await respuesta.json()

        if (!Array.isArray(datos.solicitudes)) {
          throw new Error(
            'El servidor devolvió datos inválidos.'
          )
        }

        // ==================================
        // GUARDAR SOLICITUDES REALES
        // ==================================

        setSolicitudes(datos.solicitudes)

      } catch (error) {

        if (error.name !== 'AbortError') {

          setErrorSolicitudes(
            error.message ||
            'No fue posible cargar tus solicitudes.'
          )

        }

      } finally {

        if (!controller.signal.aborted) {
          setCargandoSolicitudes(false)
        }

      }
    }

    obtenerSolicitudes()

    return () => controller.abort()

  }, [usuario])

  // ==================================
  // VERIFICAR SESIÓN
  // ==================================

  if (errorSesion) {
    return (
      <main
        className="perfil-pagina"
        role="alert"
      >
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

  // ==================================
  // INTERFAZ DEL PERFIL
  // ==================================

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

          {cargandoSolicitudes ? (

            <p>
              Cargando tus solicitudes...
            </p>

          ) : errorSolicitudes ? (

            <p role="alert">
              {errorSolicitudes}
            </p>

          ) : solicitudes.length === 0 ? (

            <p>
              Todavía no tienes solicitudes registradas.
            </p>

          ) : (

            <div className="perfil-tarjetas-grid">

              {solicitudes.map((solicitud) => (

                <TarjetaPerfil
                  key={solicitud.id_solicitud}
                  tipo="solicitud"
                  servicio={{
                    id: solicitud.id_solicitud,
                    nombre: solicitud.nombre_servicio,
                    numero: solicitud.num_pedido,
                    descripcion: solicitud.descripcion,
                    categoria: solicitud.categoria,
                    color:
                      solicitud.color ||
                      'var(--morado-natv)',
                    estado: solicitud.estado,
                    colorEstado: solicitud.color_estado
                  }}
                />

              ))}

            </div>

          )}

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
