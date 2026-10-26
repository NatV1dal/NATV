
import {
  createContext,
  useContext,
  useState
} from 'react'

// ==================================
// CONTEXT DE SOLICITUDES NATV
// ==================================

const SolicitudesContext = createContext(null)

// ==================================
// DEFINIR SECCIÓN SEGÚN ESTADO
// ==================================

export function obtenerGrupoPorEstado(estado) {

  if (estado === 'Solicitud') {
    return 'recibidas'
  }

  if (['Cotizar', 'Cotizado'].includes(estado)) {
    return 'cotizaciones'
  }

  if (estado === 'Finalizado') {
    return 'finalizados'
  }

  if ([
    'Confirmado',
    'En Proceso',
    'Revisión',
    'Correcciones',
    'Entrega de originales'
  ].includes(estado)) {
    return 'proceso'
  }

  // Evitar que una solicitud con un estado
  // desconocido desaparezca del administrador.
  return 'recibidas'
}

// ==================================
// PROVEEDOR DE SOLICITUDES
// ==================================

export function SolicitudesProvider({
  children,
  datosIniciales = []
}) {

  const [solicitudes, setSolicitudes] = useState(
    () => datosIniciales.map(
      (solicitud) => ({ ...solicitud })
    )
  )

  // Actualizar el estado de una solicitud
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

    <SolicitudesContext.Provider
      value={{
        solicitudes,
        cambiarEstado
      }}
    >
      {children}
    </SolicitudesContext.Provider>

  )
}

// ==================================
// HOOK PARA ACCEDER A SOLICITUDES
// ==================================

export function useSolicitudes() {

  const contexto = useContext(SolicitudesContext)

  if (!contexto) {
    throw new Error(
      'useSolicitudes debe utilizarse dentro de SolicitudesProvider'
    )
  }

  return contexto
}
