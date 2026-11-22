
import { Link, useNavigate } from 'react-router-dom'
import { FaPenNib, FaVideo, FaHeart } from 'react-icons/fa6'
import { useEffect, useRef, useState } from 'react'

import BienvenidaCliente from '../components/BienvenidaCliente'

import './PerfilCliente.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

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

function TarjetaPerfil({
  servicio,
  tipo,
  onEliminarFavorito,
  eliminandoFavorito
}) {

  const esSolicitud = tipo === 'solicitud'
  const navigate = useNavigate()

  // ==================================
  // ACCIÓN PRINCIPAL DE LA TARJETA
  // ==================================

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

        {/* ==================================
            ÍCONO DEL SERVICIO
        ================================== */}

        <div className="perfil-tarjeta-icono">
          <IconoServicio categoria={servicio.categoria} />
        </div>

        {/* ==================================
            INFORMACIÓN DEL SERVICIO
        ================================== */}

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

        {/* ==================================
            CORAZÓN DE FAVORITOS
        ================================== */}

        {esSolicitud ? (

          <FaHeart
            className="perfil-tarjeta-corazon"
            aria-hidden="true"
          />

        ) : (

          <button
            type="button"
            className="perfil-tarjeta-corazon-boton"
            aria-label={`Quitar ${servicio.nombre} de mis favoritos`}
            title="Quitar de favoritos"
            onClick={() => onEliminarFavorito(servicio.idFavorito)}
            disabled={eliminandoFavorito}
          >
            <FaHeart aria-hidden="true" />
          </button>

        )}

      </div>

      {/* ==================================
          BOTÓN PRINCIPAL
      ================================== */}

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
  // FAVORITOS REALES
  // ==================================

  const [favoritos, setFavoritos] = useState([])
  const [cargandoFavoritos, setCargandoFavoritos] = useState(true)
  const [errorFavoritos, setErrorFavoritos] = useState('')

  // ==================================
  // ELIMINACIÓN DE FAVORITOS
  // ==================================

  const [eliminandoFavoritoId, setEliminandoFavoritoId] = useState(null)
  const [errorEliminarFavorito, setErrorEliminarFavorito] = useState('')

  // Evita peticiones DELETE simultáneas
  const eliminandoFavoritoRef = useRef(false)

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

        if (!controller.signal.aborted) {
          setUsuario(datos.user)
        }

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
          throw new Error('No se encontró una sesión activa.')
        }

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

        if (!controller.signal.aborted) {
          setSolicitudes(datos.solicitudes)
        }

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
  // OBTENER FAVORITOS DEL CLIENTE
  // ==================================

  useEffect(() => {

    if (!usuario) {
      return
    }

    const controller = new AbortController()

    async function obtenerFavoritos() {

      setCargandoFavoritos(true)
      setErrorFavoritos('')

      try {

        const token = sessionStorage.getItem('natv_token')

        if (!token) {
          throw new Error('No se encontró una sesión activa.')
        }

        const respuesta = await fetch(
          `${API_URL}/api/favoritos`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            },
            signal: controller.signal
          }
        )

        if (!respuesta.ok) {
          throw new Error(
            'No fue posible obtener tus favoritos.'
          )
        }

        const datos = await respuesta.json()

        if (!Array.isArray(datos.favoritos)) {
          throw new Error(
            'El servidor devolvió datos inválidos.'
          )
        }

        if (!controller.signal.aborted) {
          setFavoritos(datos.favoritos)
        }

      } catch (error) {

        if (error.name !== 'AbortError') {
          setErrorFavoritos(
            error.message ||
            'No fue posible cargar tus favoritos.'
          )
        }

      } finally {

        if (!controller.signal.aborted) {
          setCargandoFavoritos(false)
        }

      }
    }

    obtenerFavoritos()

    return () => controller.abort()

  }, [usuario])

  // ==================================
  // ELIMINAR FAVORITO DESDE REACT
  // ==================================

  async function eliminarFavorito(idFavorito) {

    // Evitar solicitudes simultáneas
    if (eliminandoFavoritoRef.current) {
      return
    }

    eliminandoFavoritoRef.current = true
    setEliminandoFavoritoId(idFavorito)
    setErrorEliminarFavorito('')

    try {

      const token = sessionStorage.getItem('natv_token')

      if (!token) {
        throw new Error(
          'Tu sesión ha vencido. Vuelve a iniciar sesión.'
        )
      }

      // ==================================
      // ELIMINAR DESDE POSTGRESQL
      // ==================================

      const respuesta = await fetch(
        `${API_URL}/api/favoritos/${idFavorito}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!respuesta.ok) {

        const datos = await respuesta.json().catch(() => ({}))

        throw new Error(
          datos.message ||
          'No fue posible eliminar el favorito.'
        )
      }

      // ==================================
      // ACTUALIZAR TARJETAS SIN RECARGAR
      // ==================================

      setFavoritos((favoritosActuales) =>
        favoritosActuales.filter(
          (favorito) => favorito.id_favorito !== idFavorito
        )
      )

    } catch (error) {

      setErrorEliminarFavorito(
        error.message ||
        'No fue posible eliminar el favorito.'
      )

    } finally {

      eliminandoFavoritoRef.current = false
      setEliminandoFavoritoId(null)

    }
  }

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

            <p>Cargando tus solicitudes...</p>

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
                      solicitud.color || 'var(--morado-natv)',
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

          {/* ERROR AL ELIMINAR */}

          {errorEliminarFavorito && (
            <p
              className="perfil-favoritos-error"
              role="alert"
            >
              {errorEliminarFavorito}
            </p>
          )}

          {cargandoFavoritos ? (

            <p>Cargando tus favoritos...</p>

          ) : errorFavoritos ? (

            <p role="alert">
              {errorFavoritos}
            </p>

          ) : favoritos.length === 0 ? (

            <p>
              Todavía no tienes servicios favoritos.
            </p>

          ) : (

            <div className="perfil-tarjetas-grid">

              {favoritos.map((favorito) => (

                <TarjetaPerfil
                  key={favorito.id_favorito}
                  tipo="favorito"
                  servicio={{
                    id: favorito.id_servicio,
                    idFavorito: favorito.id_favorito,
                    nombre: favorito.nombre,
                    descripcion: favorito.descripcion,
                    categoria: favorito.categoria,
                    color:
                      favorito.color || 'var(--morado-natv)'
                  }}
                  onEliminarFavorito={eliminarFavorito}
                  eliminandoFavorito={
                    eliminandoFavoritoId !== null
                  }
                />

              ))}

            </div>

          )}

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
