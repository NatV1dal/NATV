
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import {
  FaXmark,
  FaPenNib,
  FaVideo,
  FaChevronDown
} from 'react-icons/fa6'

import './ModalDetalleSolicitud.css'

// ==================================
// FILAS DE INFORMACIÓN
// ==================================

function DatoModal({ etiqueta, valor }) {

  return (
    <div className="modal-admin-dato">
      <dt>{etiqueta}:</dt>
      <dd>{valor || 'No informado'}</dd>
    </div>
  )

}

// ==================================
// MODAL DETALLE DE SOLICITUD
// ==================================

function ModalDetalleSolicitud({
  solicitud,
  estadosDisponibles,
  cambiarEstado,
  onCerrar
}) {

  const modalRef = useRef(null)
  const botonCerrarRef = useRef(null)

  // Bloquear scroll y permitir cerrar con Escape
  useEffect(() => {

    const focoAnterior = document.activeElement
    const overflowAnterior = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    botonCerrarRef.current?.focus()

    function manejarTecla(evento) {

      if (evento.key === 'Escape') {
        onCerrar(null)
      }

      if (evento.key === 'Tab') {

        const elementos = modalRef.current?.querySelectorAll(
          'button:not(:disabled), select:not(:disabled), a[href]'
        )

        if (!elementos?.length) return

        const primero = elementos[0]
        const ultimo = elementos[elementos.length - 1]

        if (evento.shiftKey && document.activeElement === primero) {
          evento.preventDefault()
          ultimo.focus()
        } else if (
          !evento.shiftKey &&
          document.activeElement === ultimo
        ) {
          evento.preventDefault()
          primero.focus()
        }

      }

    }

    document.addEventListener('keydown', manejarTecla)

    return () => {
      document.removeEventListener('keydown', manejarTecla)
      document.body.style.overflow = overflowAnterior
      focoAnterior?.focus?.()
    }

  }, [onCerrar])

  const estadoActual = estadosDisponibles.find(
    (item) => item.nombre === solicitud.estado
  )

  return createPortal(

    <div
      className="modal-admin-fondo"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) {
          onCerrar(null)
        }
      }}
    >

      <section
        ref={modalRef}
        className="modal-admin-tarjeta"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-admin-titulo"
      >

        {/* CERRAR */}

        <button
          ref={botonCerrarRef}
          type="button"
          className="modal-admin-cerrar"
          aria-label="Cerrar detalle de solicitud"
          onClick={() => onCerrar(null)}
        >
          <FaXmark aria-hidden="true" />
        </button>

        {/* ENCABEZADO */}

        <div className="modal-admin-encabezado">

          <div className="modal-admin-servicio">

            <div
              className="modal-admin-icono"
              style={{
                backgroundColor: solicitud.color
              }}
            >

              {solicitud.tipo === 'audiovisual'
                ? <FaVideo aria-hidden="true" />
                : <FaPenNib aria-hidden="true" />}

            </div>

            <div>

              <h2 id="modal-admin-titulo">
                {solicitud.nombre}
              </h2>

              <p>
                <strong>Categoría:</strong>{' '}
                {solicitud.categoria}
              </p>

            </div>

          </div>

          <dl className="modal-admin-lista">

            <DatoModal
              etiqueta="N.º Pedido"
              valor={solicitud.numero}
            />

            <DatoModal
              etiqueta="Urgencia"
              valor={solicitud.urgencia}
            />

          </dl>

        </div>

        {/* INFORMACIÓN EN DOS COLUMNAS */}

        <div className="modal-admin-columnas">

          <dl className="modal-admin-lista">

            <DatoModal
              etiqueta="Nombre Cliente"
              valor={solicitud.cliente}
            />

            <DatoModal
              etiqueta="Fecha Solicitud"
              valor={solicitud.fechaSolicitud}
            />

            <DatoModal
              etiqueta="Fecha Entrega"
              valor={solicitud.fechaEntrega}
            />

          </dl>

          <dl className="modal-admin-lista">

            <DatoModal
              etiqueta="Email"
              valor={solicitud.email}
            />

            <DatoModal
              etiqueta="Teléfono"
              valor={solicitud.telefono}
            />

            <DatoModal
              etiqueta="Cont. Preferido"
              valor={solicitud.contactarPor}
            />

          </dl>

        </div>

        {/* DESCRIPCIÓN */}

        <div className="modal-admin-descripcion">

          <h3>Descripción</h3>

          <p>
            {solicitud.descripcion ||
              'No hay una descripción registrada para esta solicitud.'}
          </p>

        </div>

        {/* ESTADO */}

        <div className="modal-admin-estado-fila">

          <label htmlFor="modal-admin-select">
            Estado:
          </label>

          <div
            className="modal-admin-estado"
            style={{
              '--estado-color': estadoActual?.color ||
                'var(--color-solicitud)',
              '--estado-texto': estadoActual?.texto ||
                'var(--color-blanco)'
            }}
          >

            <select
              id="modal-admin-select"
              value={solicitud.estado}
              onChange={(evento) =>
                cambiarEstado(
                  solicitud.id,
                  evento.target.value
                )
              }
            >

              {estadosDisponibles.map((item) => (

                <option
                  key={item.nombre}
                  value={item.nombre}
                >
                  {item.nombre}
                </option>

              ))}

            </select>

            <FaChevronDown aria-hidden="true" />

          </div>

        </div>

      </section>

    </div>,

    document.body
  )
}

export default ModalDetalleSolicitud
