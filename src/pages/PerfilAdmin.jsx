
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  FaUser,
  FaPenNib,
  FaVideo,
  FaChevronDown
} from 'react-icons/fa6'

import ModalDetalleSolicitud from '../components/ModalDetalleSolicitud'

import {
  useSolicitudes,
  obtenerGrupoPorEstado
} from '../context/SolicitudesContext'

import './PerfilCliente.css'
import './PerfilAdmin.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
// ==================================
// ESTADOS DISPONIBLES
// ==================================

export const estadosDisponibles = [
  {
    nombre: 'Solicitud',
    color: 'var(--color-solicitud)',
    texto: 'var(--color-blanco)'
  },
  {
    nombre: 'Cotizar',
    color: 'var(--color-cotizar)',
    texto: 'var(--color-blanco)'
  },
  {
    nombre: 'Cotizado',
    color: 'var(--color-cotizado)',
    texto: 'var(--azul-natv)'
  },
  {
    nombre: 'Confirmado',
    color: 'var(--color-confirmado)',
    texto: 'var(--color-blanco)'
  },
  {
    nombre: 'En Proceso',
    color: 'var(--celeste-natv)',
    texto: 'var(--azul-natv)'
  },
  {
    nombre: 'Revisión',
    color: 'var(--color-revision)',
    texto: 'var(--azul-natv)'
  },
  {
    nombre: 'Correcciones',
    color: 'var(--color-confirmado)',
    texto: 'var(--color-blanco)'
  },
  {
    nombre: 'Entrega de originales',
    color: 'var(--color-azul-fuerte)',
    texto: 'var(--color-blanco)'
  },
  {
    nombre: 'Finalizado',
    color: 'var(--color-entregado)',
    texto: 'var(--azul-natv)'
  }
]

// ==================================
// DATOS DE DEMOSTRACIÓN
// ==================================

// Estos datos se cargan inicialmente en
// SolicitudesProvider desde App.jsx.
//
// La propiedad "grupo" se conserva como
// referencia, pero la clasificación real
// ahora depende del estado de cada pedido.

export const solicitudesIniciales = [
  {
    id: 1,
    grupo: 'recibidas',
    nombre: 'Creación de marca',
    categoria: 'Branding e identidad',
    tipo: 'branding',
    color: 'var(--azul-natv)',
    numero: 'N2209',
    cliente: 'Ariel Galindo',
    fechaSolicitud: '24/01/2026',
    fechaEntrega: '27/01/2026',
    urgencia: 'Baja',
    email: 'correo@gmail.com',
    telefono: '+56 9 7777 77 77',
    contactarPor: 'Email',
    descripcion:
      'El cliente solicita desarrollar una identidad visual para su marca, incluyendo propuestas de logotipo y aplicaciones gráficas.',
    estado: 'Solicitud'
  },
  {
    id: 2,
    grupo: 'cotizaciones',
    nombre: 'Adaptación videos',
    categoria: 'Audiovisual',
    tipo: 'audiovisual',
    color: 'var(--color-azul-fuerte)',
    numero: 'N2210',
    cliente: 'Ariel',
    email: 'correo@gmail.com',
    urgencia: 'Media',
    descripcion:
      'Adaptación de material audiovisual para distintos formatos digitales.',
    estado: 'Cotizar'
  },
  {
    id: 3,
    grupo: 'proceso',
    nombre: 'Toma aérea con dron',
    categoria: 'Audiovisual',
    tipo: 'audiovisual',
    color: 'var(--color-azul-fuerte)',
    numero: 'N2211',
    cliente: 'Ariel',
    fechaEntrega: '02/02/2026',
    descripcion:
      'Registro audiovisual aéreo para un proyecto del cliente.',
    estado: 'Revisión'
  },
  {
    id: 4,
    grupo: 'proceso',
    nombre: 'Toma aérea con dron',
    categoria: 'Audiovisual',
    tipo: 'audiovisual',
    color: 'var(--color-azul-fuerte)',
    numero: 'N2212',
    cliente: 'Ariel',
    fechaEntrega: '02/02/2026',
    descripcion:
      'Captura de fotografías y videos aéreos.',
    estado: 'En Proceso'
  }
]

// ==================================
// COMPONENTE: FILA DE INFORMACIÓN
// ==================================

function FilaInformacion({ etiqueta, valor }) {

  return (
    <div className="admin-fila">

      <dt>{etiqueta}:</dt>

      <dd>{valor}</dd>

    </div>
  )
}

// ==================================
// COMPONENTE: TARJETA ADMINISTRADOR
// ==================================

function TarjetaAdmin({
  solicitud,
  cambiarEstado,
  onVerDetalle
}) {

  // Estado actual y sus colores
  const estadoActual = estadosDisponibles.find(
    (estado) => estado.nombre === solicitud.estado
  )

  // Determinar icono del servicio
  const esAudiovisual =
    solicitud.tipo === 'audiovisual'

  // ==================================
  // ABRIR DETALLE DE SOLICITUD
  // ==================================

  function verDetalles() {
    onVerDetalle(solicitud.id)
  }

  return (

    <article
      className="admin-tarjeta"
      style={{
        '--admin-color': solicitud.color
      }}
    >

      {/* ==================================
          ENCABEZADO DE TARJETA
      ================================== */}

      <div className="admin-tarjeta-encabezado">

        <div className="admin-tarjeta-icono">

          {esAudiovisual
            ? <FaVideo aria-hidden="true" />
            : <FaPenNib aria-hidden="true" />}

        </div>

        <div className="admin-tarjeta-titulo">

          <h3>{solicitud.nombre}</h3>

          <p>
            Categoría: {solicitud.categoria}
          </p>

        </div>

      </div>

      {/* ==================================
          INFORMACIÓN DE SOLICITUD
      ================================== */}

      <dl className="admin-tarjeta-datos">

        <FilaInformacion
          etiqueta="N.º Pedido"
          valor={solicitud.numero}
        />

        <FilaInformacion
          etiqueta="Nombre Cliente"
          valor={solicitud.cliente}
        />

        {solicitud.fechaSolicitud && (

          <FilaInformacion
            etiqueta="Fecha Solicitud"
            valor={solicitud.fechaSolicitud}
          />

        )}

        {solicitud.fechaEntrega && (

          <FilaInformacion
            etiqueta="Fecha Entrega"
            valor={solicitud.fechaEntrega}
          />

        )}

        {solicitud.urgencia && (

          <FilaInformacion
            etiqueta="Urgencia"
            valor={solicitud.urgencia}
          />

        )}

        {solicitud.email && (

          <FilaInformacion
            etiqueta="Email"
            valor={solicitud.email}
          />

        )}

        {solicitud.telefono && (

          <FilaInformacion
            etiqueta="Teléfono"
            valor={solicitud.telefono}
          />

        )}

        {solicitud.contactarPor && (

          <FilaInformacion
            etiqueta="Contactar por"
            valor={solicitud.contactarPor}
          />

        )}

        {/* ==================================
            SELECTOR DE ESTADO
        ================================== */}

        <div className="admin-fila">

          <dt>Estado:</dt>

          <dd>

            <div
              className="admin-estado"
              style={{
                '--estado-color': estadoActual?.color,
                '--estado-texto': estadoActual?.texto
              }}
            >

              <select
                value={solicitud.estado}
                aria-label={`Estado del pedido ${solicitud.numero}`}
                onChange={(evento) =>
                  cambiarEstado(
                    solicitud.id,
                    evento.target.value
                  )
                }
              >

                {estadosDisponibles.map((estado) => (

                  <option
                    key={estado.nombre}
                    value={estado.nombre}
                  >
                    {estado.nombre}
                  </option>

                ))}

              </select>

              <FaChevronDown
                className="admin-estado-flecha"
                aria-hidden="true"
              />

            </div>

          </dd>

        </div>

      </dl>

      {/* ==================================
          BOTÓN VER DETALLES
      ================================== */}

      <button
        type="button"
        className="admin-tarjeta-boton"
        onClick={verDetalles}
      >
        Ver detalles
      </button>

    </article>

  )
}

// ==================================
// COMPONENTE: SECCIÓN ADMINISTRADOR
// ==================================

export function SeccionAdmin({
  titulo,
  solicitudes,
  cambiarEstado,
  id,
  rutaVerMas
}) {

  // ==================================
  // CONTROL DEL MODAL
  // ==================================

  const [idDetalle, setIdDetalle] = useState(null)

  // Obtener TODAS las solicitudes compartidas
  const {
    solicitudes: todasSolicitudes
  } = useSolicitudes()

  // Buscar la solicitud en el Context global,
  // no solamente en la sección actual.
  //
  // Esto permite que el popup permanezca abierto
  // aunque el estado mueva la tarjeta de sección.

  const solicitudSeleccionada = todasSolicitudes.find(
    (solicitud) => solicitud.id === idDetalle
  )

  return (

    <section className="admin-seccion" id={id}>

      {/* ==================================
          TÍTULO
      ================================== */}

      <h2>{titulo}</h2>

      {/* ==================================
          TARJETAS
      ================================== */}

      <div className="admin-tarjetas-grid">

        {solicitudes.length > 0 ? (

          solicitudes.map((solicitud) => (

            <TarjetaAdmin
              key={solicitud.id}
              solicitud={solicitud}
              cambiarEstado={cambiarEstado}
              onVerDetalle={setIdDetalle}
            />

          ))

        ) : (

          <p className="admin-sin-solicitudes">
            No hay solicitudes en esta sección.
          </p>

        )}

      </div>

      {/* ==================================
          BOTÓN VER MÁS
      ================================== */}

      {rutaVerMas && (

        <div className="admin-ver-mas-contenedor">

          <Link
            to={rutaVerMas}
            className="admin-ver-mas"
          >
            Ver más
          </Link>

        </div>

      )}

      {/* ==================================
          MODAL VER DETALLES
      ================================== */}

      {solicitudSeleccionada && (

        <ModalDetalleSolicitud
          solicitud={solicitudSeleccionada}
          estadosDisponibles={estadosDisponibles}
          cambiarEstado={cambiarEstado}
          onCerrar={setIdDetalle}
        />

      )}

    </section>

  )
}

// ==================================
// PÁGINA: PERFIL ADMINISTRADOR
// ==================================

function PerfilAdmin() {

  // ==================================
  // DATOS DEL USUARIO AUTENTICADO
  // ==================================

  const navigate = useNavigate()

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

        if (respuesta.status === 401) {
          sessionStorage.removeItem('natv_token')
          navigate('/login', { replace: true })
          return
        }

        if (!respuesta.ok) {
          throw new Error('No fue posible consultar la sesión.')
        }

        const datos = await respuesta.json()

        // Comprobar que sea administrador
        if (datos.user?.rol !== 'administrador') {
          navigate('/perfil', { replace: true })
          return
        }

        setUsuario(datos.user)

      } catch (error) {

        if (error.name !== 'AbortError') {
          setErrorSesion('No fue posible cargar tus datos. Recarga la página.')
        }

      }
    }

    obtenerUsuario()

    return () => controller.abort()

  }, [navigate])


  // ==================================
  // DATOS COMPARTIDOS DESDE CONTEXT
  // ==================================

  const {
    solicitudes,
    cambiarEstado
  } = useSolicitudes()

  // ==================================
  // SOLICITUDES RECIBIDAS
  // ==================================

  const recibidas = solicitudes.filter(
    (solicitud) =>
      obtenerGrupoPorEstado(solicitud.estado) ===
      'recibidas'
  )

  // ==================================
  // COTIZACIONES
  // ==================================

  const cotizaciones = solicitudes.filter(
    (solicitud) =>
      obtenerGrupoPorEstado(solicitud.estado) ===
      'cotizaciones'
  )

  // ==================================
  // SERVICIOS EN PROCESO
  // ==================================

  const enProceso = solicitudes.filter(
    (solicitud) =>
      obtenerGrupoPorEstado(solicitud.estado) ===
      'proceso'
  )

  // ==================================
  // SERVICIOS FINALIZADOS
  // ==================================

  const finalizados = solicitudes.filter(
    (solicitud) =>
      obtenerGrupoPorEstado(solicitud.estado) ===
      'finalizados'
  )

  if (errorSesion) {
  return <main className="perfil-pagina" role="alert">{errorSesion}</main>
}

if (!usuario) {
  return <main className="perfil-pagina">Verificando sesión...</main>
}

  return (

    <main className="perfil-pagina admin-pagina">

      <div className="perfil-contenedor">

        {/* ==================================
            BIENVENIDA
        ================================== */}

        <section className="perfil-bienvenida">

          <div className="perfil-bienvenida-texto">

           <h1>¡Hola, {usuario.nombre}!</h1>

            <p>
              Administra las solicitudes recibidas,
              cotizaciones y servicios en desarrollo
              desde tu panel NATV.
            </p>

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

        {/* ==================================
            SOLICITUDES RECIBIDAS
        ================================== */}

        <SeccionAdmin
          id="solicitudes-recibidas"
          titulo="Solicitudes recibidas"
          solicitudes={recibidas}
          cambiarEstado={cambiarEstado}
          rutaVerMas="/admin/solicitudes"
        />

        {/* ==================================
            COTIZACIONES
        ================================== */}

        <SeccionAdmin
          id="cotizaciones-pendientes"
          titulo="Cotizaciones"
          solicitudes={cotizaciones}
          cambiarEstado={cambiarEstado}
          rutaVerMas="/admin/cotizaciones"
        />

        {/* ==================================
            SERVICIOS EN PROCESO
        ================================== */}

        <SeccionAdmin
          id="servicios-en-proceso"
          titulo="Servicios en proceso"
          solicitudes={enProceso}
          cambiarEstado={cambiarEstado}
          rutaVerMas="/admin/procesos"
        />

        {/* ==================================
            SERVICIOS FINALIZADOS
        ================================== */}

        <SeccionAdmin
          id="servicios-finalizados"
          titulo="Servicios finalizados"
          solicitudes={finalizados}
          cambiarEstado={cambiarEstado}
          rutaVerMas="/admin/finalizados"
        />

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

export default PerfilAdmin
