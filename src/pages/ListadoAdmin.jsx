import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaUser } from 'react-icons/fa6'

import { SeccionAdmin } from './PerfilAdmin'

import {
  useSolicitudes,
  obtenerGrupoPorEstado
} from '../context/SolicitudesContext'

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
    titulo: 'Cotizaciones',
    grupo: 'cotizaciones'
  },

  procesos: {
    titulo: 'Servicios en proceso',
    grupo: 'proceso'
  },

  finalizados: {
    titulo: 'Servicios finalizados',
    grupo: 'finalizados'
  }

}

// ==================================
// FILTROS INICIALES
// ==================================

const filtrosIniciales = {
  pedido: '',
  categoria: '',
  prioridad: '',
  fechaDesde: '',
  fechaHasta: '',
  estado: ''
}

// ==================================
// ESTILOS DE LOS FILTROS
// ==================================

const estilos = {

  encabezado: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '15px',
    width: '100%'
  },

  opciones: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '7px',
    fontSize: '14px',
    fontWeight: 'var(--font-semibold)'
  },

  boton: {
    padding: '3px 0',
    border: 'none',
    background: 'transparent',
    fontFamily: 'var(--fuente-principal)',
    fontSize: '14px',
    fontWeight: 'var(--font-semibold)',
    cursor: 'pointer'
  },

  panel: {
    display: 'flex',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: '15px',
    width: '100%',
    marginTop: '20px',
    padding: '18px',
    borderRadius: '10px',
    backgroundColor: 'var(--color-blanco)'
  },

  campo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px',
    fontSize: '13px',
    fontWeight: 'var(--font-medium)',
    color: 'var(--azul-natv)'
  },

  control: {
    minWidth: '170px',
    maxWidth: '100%',
    padding: '9px 12px',
    border: '1px solid var(--gris-claro)',
    borderRadius: '7px',
    backgroundColor: 'var(--color-blanco)',
    color: 'var(--azul-natv)',
    fontFamily: 'var(--fuente-principal)',
    fontSize: '13px'
  },

  limpiar: {
    padding: '7px 12px',
    border: 'none',
    background: 'transparent',
    color: 'var(--morado-natv)',
    fontFamily: 'var(--fuente-principal)',
    fontSize: '13px',
    fontWeight: 'var(--font-semibold)',
    cursor: 'pointer'
  }

}

// ==================================
// CONVERTIR FECHAS DD/MM/AAAA
// ==================================

function convertirFecha(fecha) {

  if (!fecha) return ''

  // Si ya viene en formato AAAA-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return fecha
  }

  // Convertir DD/MM/AAAA a AAAA-MM-DD
  const partes = fecha.split('/')

  if (partes.length !== 3) return ''

  const [dia, mes, anio] = partes

  return (
    `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
  )

}

// ==================================
// COMPONENTE: BARRA DE FILTROS
// ==================================

function BarraFiltros({
  titulo,
  categorias,
  estados,
  filtros,
  actualizarFiltro,
  limpiarFiltros,
  total,
  visibles
}) {

  // ==================================
  // CONTROL DEL FILTRO ABIERTO
  // ==================================

  const [filtroAbierto, setFiltroAbierto] = useState(null)

  // ==================================
  // OPCIONES DISPONIBLES
  // ==================================

  const opciones = [
    { id: 'pedido', nombre: 'N.º Pedido' },
    { id: 'categoria', nombre: 'Categoría' },
    { id: 'prioridad', nombre: 'Prioridad' },
    { id: 'fecha', nombre: 'Fecha' },
    { id: 'estado', nombre: 'Estado' }
  ]

  // Determinar si existen filtros aplicados
  const hayFiltros = Object.values(filtros).some(
    (valor) => valor !== ''
  )

  // ==================================
  // ABRIR O CERRAR FILTRO
  // ==================================

  function alternarFiltro(id) {

    setFiltroAbierto((anterior) =>
      anterior === id ? null : id
    )

  }

  // ==================================
  // LIMPIAR TODOS LOS FILTROS
  // ==================================

  function limpiarTodo() {

    limpiarFiltros()
    setFiltroAbierto(null)

  }

  return (

    <span
      style={{
        display: 'block',
        width: '100%'
      }}
    >

      {/* ==================================
          ENCABEZADO Y OPCIONES
      ================================== */}

      <span style={estilos.encabezado}>

        <span>{titulo}</span>

        <span
          style={estilos.opciones}
          role="group"
          aria-label="Filtrar solicitudes"
        >

          <span>Filtrar por:</span>

          {opciones.map((opcion, indice) => {

            const activo =
              filtroAbierto === opcion.id

            const aplicado =
              opcion.id === 'fecha'
                ? Boolean(
                    filtros.fechaDesde ||
                    filtros.fechaHasta
                  )
                : Boolean(filtros[opcion.id])

            return (

              <span
                key={opcion.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px'
                }}
              >

                <button
                  type="button"
                  style={{
                    ...estilos.boton,
                    color:
                      activo || aplicado
                        ? 'var(--morado-natv)'
                        : 'var(--azul-natv)',

                    textDecoration:
                      activo ? 'underline' : 'none'
                  }}
                  aria-expanded={activo}
                  aria-pressed={aplicado}
                  onClick={() =>
                    alternarFiltro(opcion.id)
                  }
                >
                  {opcion.nombre}
                </button>

                {indice < opciones.length - 1 && (

                  <span aria-hidden="true">
                    |
                  </span>

                )}

              </span>

            )

          })}

        </span>

      </span>

      {/* ==================================
          PANEL DE FILTROS
      ================================== */}

      {filtroAbierto && (

        <span style={estilos.panel}>

          {/* ==================================
              FILTRO N.º DE PEDIDO
          ================================== */}

          {filtroAbierto === 'pedido' && (

            <label style={estilos.campo}>

              Buscar por N.º de pedido

              <input
                type="search"
                placeholder="Ej: N2209"
                value={filtros.pedido}
                style={estilos.control}
                onChange={(evento) =>
                  actualizarFiltro(
                    'pedido',
                    evento.target.value
                  )
                }
              />

            </label>

          )}

          {/* ==================================
              FILTRO CATEGORÍA
          ================================== */}

          {filtroAbierto === 'categoria' && (

            <label style={estilos.campo}>

              Seleccionar categoría

              <select
                value={filtros.categoria}
                style={estilos.control}
                onChange={(evento) =>
                  actualizarFiltro(
                    'categoria',
                    evento.target.value
                  )
                }
              >

                <option value="">
                  Todas las categorías
                </option>

                {categorias.map((categoria) => (

                  <option
                    key={categoria}
                    value={categoria}
                  >
                    {categoria}
                  </option>

                ))}

              </select>

            </label>

          )}

          {/* ==================================
              FILTRO PRIORIDAD
          ================================== */}

          {filtroAbierto === 'prioridad' && (

            <label style={estilos.campo}>

              Seleccionar prioridad

              <select
                value={filtros.prioridad}
                style={estilos.control}
                onChange={(evento) =>
                  actualizarFiltro(
                    'prioridad',
                    evento.target.value
                  )
                }
              >

                <option value="">
                  Todas las prioridades
                </option>

                <option value="Alta">
                  Alta
                </option>

                <option value="Media">
                  Media
                </option>

                <option value="Baja">
                  Baja
                </option>

              </select>

            </label>

          )}

          {/* ==================================
              FILTRO FECHA
          ================================== */}

          {filtroAbierto === 'fecha' && (

            <>

              <label style={estilos.campo}>

                Desde

                <input
                  type="date"
                  value={filtros.fechaDesde}
                  style={estilos.control}
                  max={filtros.fechaHasta || undefined}
                  onChange={(evento) =>
                    actualizarFiltro(
                      'fechaDesde',
                      evento.target.value
                    )
                  }
                />

              </label>

              <label style={estilos.campo}>

                Hasta

                <input
                  type="date"
                  value={filtros.fechaHasta}
                  min={filtros.fechaDesde || undefined}
                  style={estilos.control}
                  onChange={(evento) =>
                    actualizarFiltro(
                      'fechaHasta',
                      evento.target.value
                    )
                  }
                />

              </label>

            </>

          )}

          {/* ==================================
              FILTRO ESTADO
          ================================== */}

          {filtroAbierto === 'estado' && (

            <label style={estilos.campo}>

              Seleccionar estado

              <select
                value={filtros.estado}
                style={estilos.control}
                onChange={(evento) =>
                  actualizarFiltro(
                    'estado',
                    evento.target.value
                  )
                }
              >

                <option value="">
                  Todos los estados
                </option>

                {estados.map((estado) => (

                  <option
                    key={estado}
                    value={estado}
                  >
                    {estado}
                  </option>

                ))}

              </select>

            </label>

          )}

          {/* ==================================
              CERRAR PANEL
          ================================== */}

          <button
            type="button"
            onClick={() => setFiltroAbierto(null)}
            style={estilos.limpiar}
          >
            Cerrar
          </button>

        </span>

      )}

      {/* ==================================
          RESULTADOS Y LIMPIAR FILTROS
      ================================== */}

      {hayFiltros && (

        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px',
            marginTop: '15px',
            fontSize: '12px',
            fontWeight: 'var(--font-regular)',
            color: 'var(--gris-oscuro)'
          }}
          aria-live="polite"
        >

          <span>

            Mostrando {visibles} de {total} solicitudes

          </span>

          <button
            type="button"
            onClick={limpiarTodo}
            style={estilos.limpiar}
          >
            Limpiar filtros
          </button>

        </span>

      )}

    </span>

  )
}

// ==================================
// PÁGINA: LISTADO ADMINISTRADOR
// ==================================

function ListadoAdmin() {

  // ==================================
  // IDENTIFICAR SECCIÓN DESDE LA URL
  // ==================================

  const { seccion } = useParams()

  const configuracion = secciones[seccion]

  // ==================================
  // SOLICITUDES COMPARTIDAS
  // ==================================

  const {
    solicitudes,
    cambiarEstado
  } = useSolicitudes()

  // ==================================
  // ESTADO DE LOS FILTROS
  // ==================================

  const [filtros, setFiltros] = useState({
    ...filtrosIniciales
  })

  // ==================================
  // REINICIAR FILTROS AL CAMBIAR
  // DE SECCIÓN
  // ==================================

  useEffect(() => {

    setFiltros({ ...filtrosIniciales })

  }, [seccion])

  // ==================================
  // ACTUALIZAR UN FILTRO
  // ==================================

  function actualizarFiltro(nombre, valor) {

    setFiltros((anteriores) => ({
      ...anteriores,
      [nombre]: valor
    }))

  }

  // ==================================
  // LIMPIAR TODOS LOS FILTROS
  // ==================================

  function limpiarFiltros() {

    setFiltros({ ...filtrosIniciales })

  }

  // ==================================
  // SOLICITUDES SEGÚN SU ESTADO
  // ==================================

  // Ya NO filtramos por solicitud.grupo.
  //
  // La función obtenerGrupoPorEstado()
  // determina automáticamente la sección
  // donde debe aparecer cada pedido.

  const solicitudesSeccion = solicitudes.filter(
    (solicitud) =>
      obtenerGrupoPorEstado(solicitud.estado) ===
      configuracion?.grupo
  )

  // ==================================
  // CATEGORÍAS DISPONIBLES
  // ==================================

  const categorias = [
    ...new Set(
      solicitudesSeccion
        .map((solicitud) => solicitud.categoria)
        .filter(Boolean)
    )
  ]

  // ==================================
  // ESTADOS DISPONIBLES
  // ==================================

  const estados = [
    ...new Set(
      solicitudesSeccion
        .map((solicitud) => solicitud.estado)
        .filter(Boolean)
    )
  ]

  // ==================================
  // APLICAR LOS CINCO FILTROS
  // ==================================

  const solicitudesFiltradas = solicitudesSeccion.filter(
    (solicitud) => {

      // ==================================
      // 1. N.º DE PEDIDO
      // ==================================

      if (filtros.pedido.trim()) {

        const pedidoBuscado = filtros.pedido
          .trim()
          .toLowerCase()

        const numeroPedido = String(
          solicitud.numero || ''
        ).toLowerCase()

        if (!numeroPedido.includes(pedidoBuscado)) {
          return false
        }

      }

      // ==================================
      // 2. CATEGORÍA
      // ==================================

      if (
        filtros.categoria &&
        solicitud.categoria !== filtros.categoria
      ) {
        return false
      }

      // ==================================
      // 3. PRIORIDAD
      // ==================================

      if (
        filtros.prioridad &&
        solicitud.urgencia !== filtros.prioridad
      ) {
        return false
      }

      // ==================================
      // 4. ESTADO
      // ==================================

      if (
        filtros.estado &&
        solicitud.estado !== filtros.estado
      ) {
        return false
      }

      // ==================================
      // 5. FECHA
      // ==================================

      if (
        filtros.fechaDesde ||
        filtros.fechaHasta
      ) {

        // En servicios en proceso y finalizados
        // priorizamos la fecha de entrega.
        //
        // En solicitudes y cotizaciones,
        // priorizamos la fecha de solicitud.
        //
        // Si no existe la principal, usamos
        // la otra fecha disponible.

        const usarFechaEntrega = [
          'procesos',
          'finalizados'
        ].includes(seccion)

        const fechaOriginal = usarFechaEntrega
          ? (
              solicitud.fechaEntrega ||
              solicitud.fechaSolicitud
            )
          : (
              solicitud.fechaSolicitud ||
              solicitud.fechaEntrega
            )

        const fecha = convertirFecha(fechaOriginal)

        // Sin fecha registrada no podemos
        // comprobar un rango de fechas.
        if (!fecha) {
          return false
        }

        // Fecha desde
        if (
          filtros.fechaDesde &&
          fecha < filtros.fechaDesde
        ) {
          return false
        }

        // Fecha hasta
        if (
          filtros.fechaHasta &&
          fecha > filtros.fechaHasta
        ) {
          return false
        }

      }

      // La solicitud cumple los filtros
      return true

    }
  )

  // ==================================
  // SECCIÓN NO ENCONTRADA
  // ==================================

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

  // ==================================
  // INTERFAZ LISTADO ADMINISTRADOR
  // ==================================

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

          {/* Avatar */}

          <div className="perfil-avatar-marco">

            <div className="perfil-avatar">

              <FaUser
                aria-label="Avatar predeterminado"
              />

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
            LISTADO Y FILTROS
        ================================== */}

        <SeccionAdmin
          id={seccion}

          titulo={
            <BarraFiltros
              titulo={configuracion.titulo}
              categorias={categorias}
              estados={estados}
              filtros={filtros}
              actualizarFiltro={actualizarFiltro}
              limpiarFiltros={limpiarFiltros}
              total={solicitudesSeccion.length}
              visibles={solicitudesFiltradas.length}
            />
          }

          solicitudes={solicitudesFiltradas}
          cambiarEstado={cambiarEstado}
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

export default ListadoAdmin
