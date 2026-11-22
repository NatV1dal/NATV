
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import BienvenidaCliente from '../components/BienvenidaCliente'

import './PerfilCliente.css'
import './EstadoSolicitud.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// ==================================
// ETAPAS DE LAS SOLICITUDES NATV
// ==================================

const etapas = [
  {
    orden: 1,
    nombre: 'Solicitud',
    descripcion: 'Hemos recibido tu solicitud y pronto revisaremos los detalles.',
    color: '#FF8D28'
  },
  {
    orden: 2,
    nombre: 'Cotizar',
    descripcion: 'Estamos preparando la cotización de tu servicio.',
    color: '#FF383C'
  },
  {
    orden: 3,
    nombre: 'Cotizado',
    descripcion: 'Te hemos enviado la propuesta para tu revisión.',
    color: '#F69E9F'
  },
  {
    orden: 4,
    nombre: 'Confirmado',
    descripcion: 'Tu servicio ha sido confirmado y está listo para comenzar.',
    color: '#9E6ED0'
  },
  {
    orden: 5,
    nombre: 'En Proceso',
    descripcion: 'Estamos trabajando en tu proyecto.',
    color: '#00C0E8'
  },
  {
    orden: 6,
    nombre: 'Revisión',
    descripcion: 'Estamos revisando los avances y detalles del proyecto.',
    color: '#FFCC00'
  },
  {
    orden: 7,
    nombre: 'Correcciones',
    descripcion: 'Estamos realizando los ajustes necesarios.',
    color: '#FFCC00'
  },
  {
    orden: 8,
    nombre: 'Entrega de originales',
    descripcion: 'Estamos preparando la entrega de los archivos finales.',
    color: '#34C759'
  },
  {
    orden: 9,
    nombre: 'Finalizado',
    descripcion: 'Tu proyecto ha finalizado. ¡Gracias por confiar en NATV!',
    color: '#34C759'
  }
]

// ==================================
// PÁGINA: ESTADO DE LA SOLICITUD
// ==================================

function EstadoSolicitud() {

  const { id } = useParams()

  // ==================================
  // ESTADOS DEL COMPONENTE
  // ==================================

  const [solicitud, setSolicitud] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // ==================================
  // OBTENER SOLICITUD DESDE LA API
  // ==================================

  useEffect(() => {

    const controller = new AbortController()

    async function obtenerSolicitud() {

      setCargando(true)
      setError('')
      setSolicitud(null)

      try {

        const token = sessionStorage.getItem('natv_token')

        if (!token) {
          throw new Error('Debes iniciar sesión para consultar tu solicitud.')
        }

        const respuesta = await fetch(
          `${API_URL}/api/solicitudes/${id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            },
            signal: controller.signal
          }
        )

        if (respuesta.status === 404) {
          throw new Error('No encontramos la solicitud seleccionada.')
        }

        if (respuesta.status === 401) {
          throw new Error('Tu sesión ha vencido. Vuelve a iniciar sesión.')
        }

        if (!respuesta.ok) {
          throw new Error('No fue posible consultar el estado de tu solicitud.')
        }

        const datos = await respuesta.json()

        if (!datos.solicitud) {
          throw new Error('El servidor no devolvió la solicitud.')
        }

        if (!controller.signal.aborted) {
          setSolicitud(datos.solicitud)
        }

      } catch (error) {

        if (error.name !== 'AbortError') {
          setError(error.message)
        }

      } finally {

        if (!controller.signal.aborted) {
          setCargando(false)
        }

      }

    }

    obtenerSolicitud()

    return () => controller.abort()

  }, [id])

  // ==================================
  // ESTADO DE CARGA
  // ==================================

  if (cargando) {
    return (
      <main className="perfil-pagina estado-solicitud-pagina">
        <div className="perfil-contenedor">
          <p>Cargando el estado de tu solicitud...</p>
        </div>
      </main>
    )
  }

  // ==================================
  // SOLICITUD NO DISPONIBLE
  // ==================================

  if (error || !solicitud) {
    return (
      <main className="estado-no-encontrado">
        <h1>No fue posible consultar la solicitud</h1>

        <p>
          {error || 'No encontramos la solicitud seleccionada.'}
        </p>

        <Link to="/perfil">
          Volver a mi perfil
        </Link>
      </main>
    )
  }

  // ==================================
  // IDENTIFICAR EL ESTADO ACTUAL
  // ==================================

  const ordenActual = Number(solicitud.orden_estado)

  // ==================================
  // INTERFAZ DEL SEGUIMIENTO
  // ==================================

  return (
    <main className="perfil-pagina estado-solicitud-pagina">

      <div className="perfil-contenedor">

        <BienvenidaCliente />

        <section className="estado-panel">

          <h2>
            Estado de mi solicitud | N° Pedido: {solicitud.num_pedido}
          </h2>

          <ol
            className="estado-linea-tiempo"
            aria-label="Seguimiento de la solicitud"
          >

            {etapas.map((etapa) => {

              const alcanzada = etapa.orden <= ordenActual
              const actual = etapa.orden === ordenActual

              const colorEtapa = actual
                ? solicitud.color_estado || etapa.color
                : etapa.color

              return (
                <li
                  key={etapa.orden}
                  className={
                    alcanzada
                      ? 'estado-etapa estado-etapa-activa'
                      : 'estado-etapa'
                  }
                  style={
                    alcanzada
                      ? { '--color-etapa': colorEtapa }
                      : undefined
                  }
                  aria-current={actual ? 'step' : undefined}
                >

                  <h3>{etapa.nombre}</h3>

                  <p>
                    {actual
                      ? solicitud.descripcion_estado || etapa.descripcion
                      : etapa.descripcion}
                  </p>

                </li>
              )

            })}

          </ol>

        </section>

        <div
          className="perfil-puntos"
          aria-hidden="true"
        />

      </div>

    </main>
  )
}

export default EstadoSolicitud
