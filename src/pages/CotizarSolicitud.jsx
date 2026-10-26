
import { useRef, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'

import {
  FaUser,
  FaPenNib,
  FaVideo,
  FaPaperclip,
  FaXmark
} from 'react-icons/fa6'

import { solicitudesIniciales } from './PerfilAdmin'

import './PerfilCliente.css'
import './CotizarSolicitud.css'

// ==================================
// COMPONENTE: FILA DE INFORMACIÓN
// ==================================

function DatoCotizacion({ etiqueta, valor }) {
  return (
    <div className="cotizar-dato">
      <dt>{etiqueta}:</dt>
      <dd>{valor || 'No informado'}</dd>
    </div>
  )
}

// ==================================
// PÁGINA: COTIZAR SOLICITUD
// ==================================

function CotizarSolicitud() {

  
    const { id } = useParams()

    const { state } = useLocation()

    // Usar los datos actualizados enviados desde el popup.
    // Si se abre la ruta directamente, buscar en los datos demo.

    const solicitud =
    state?.solicitud &&
    String(state.solicitud.id) === id
        ? state.solicitud
        : solicitudesIniciales.find(
            (item) => String(item.id) === id
        )


  const [mensaje, setMensaje] = useState('')
  const [archivo, setArchivo] = useState(null)
  const [errorArchivo, setErrorArchivo] = useState('')
  const [aviso, setAviso] = useState('')

  const archivoRef = useRef(null)

  // ==================================
  // SELECCIONAR PDF
  // ==================================

  function seleccionarArchivo(evento) {

    const seleccionado = evento.target.files?.[0]

    if (!seleccionado) return

    const esPDF =
      seleccionado.type === 'application/pdf' ||
      seleccionado.name.toLowerCase().endsWith('.pdf')

    if (!esPDF) {

      setArchivo(null)
      setErrorArchivo(
        'Solo puedes adjuntar archivos en formato PDF.'
      )

      evento.target.value = ''
      return
    }

    setArchivo(seleccionado)
    setErrorArchivo('')
    setAviso('')
  }

  // ==================================
  // QUITAR PDF
  // ==================================

  function quitarArchivo() {

    setArchivo(null)
    setErrorArchivo('')
    setAviso('')

    if (archivoRef.current) {
      archivoRef.current.value = ''
    }
  }

  // ==================================
  // VALIDACIÓN DEL FORMULARIO
  // ==================================

  function enviarCotizacion(evento) {

    evento.preventDefault()
    setAviso('')

    if (!mensaje.trim()) {
      setAviso('Debes escribir un mensaje para el cliente.')
      return
    }

    if (!archivo) {
      setAviso('Debes adjuntar la cotización en PDF.')
      return
    }

    // Pendiente: conectar con la API del backend.
    // No se envía ningún correo en esta demostración.

    setAviso(
      'Formulario validado correctamente. ' +
      'Esta es una demostración: la cotización ' +
      'todavía no se ha enviado al cliente.'
    )
  }

  // ==================================
  // SOLICITUD NO ENCONTRADA
  // ==================================

  if (!solicitud) {

    return (
      <main className="perfil-pagina">

        <div className="perfil-contenedor">

          <h1>Solicitud no encontrada</h1>

          <p>
            No encontramos una cotización pendiente
            con ese número de registro.
          </p>

          <Link to="/admin/cotizaciones">
            Volver a cotizaciones
          </Link>

        </div>

      </main>
    )
  }

  const esAudiovisual =
    solicitud.tipo === 'audiovisual'

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
              Prepara y administra las cotizaciones
              de los servicios solicitados.
            </p>

          </div>

          <div className="perfil-avatar-marco">

            <div className="perfil-avatar">
              <FaUser aria-label="Avatar predeterminado" />
            </div>

          </div>

          <Link
            to="/perfil/editar"
            className="perfil-editar-boton"
          >
            Editar datos
          </Link>

        </section>

        {/* ==================================
            CONTENEDOR
        ================================== */}

        <section className="cotizar-contenedor">

          <div className="cotizar-titulo-fila">

            <h2>Cotizar solicitud</h2>

            <Link
              to="/admin/cotizaciones"
              className="cotizar-volver"
            >
              Volver a cotizaciones
            </Link>

          </div>

          {/* ==================================
              DETALLE DE LA SOLICITUD
          ================================== */}

          <article className="cotizar-detalle">

            <div className="cotizar-encabezado">

              <div className="cotizar-servicio">

                <div
                  className="cotizar-icono"
                  style={{
                    backgroundColor: solicitud.color
                  }}
                >

                  {esAudiovisual
                    ? <FaVideo aria-hidden="true" />
                    : <FaPenNib aria-hidden="true" />}

                </div>

                <div>

                  <h3>{solicitud.nombre}</h3>

                  <p>
                    <strong>Categoría:</strong>{' '}
                    {solicitud.categoria}
                  </p>

                </div>

              </div>

              <dl className="cotizar-lista">

                <DatoCotizacion
                  etiqueta="N.º Pedido"
                  valor={solicitud.numero}
                />

                <DatoCotizacion
                  etiqueta="Urgencia"
                  valor={solicitud.urgencia}
                />

              </dl>

            </div>

            {/* DATOS DEL CLIENTE */}

            <div className="cotizar-columnas">

              <dl className="cotizar-lista">

                <DatoCotizacion
                  etiqueta="Nombre Cliente"
                  valor={solicitud.cliente}
                />

                <DatoCotizacion
                  etiqueta="Fecha Solicitud"
                  valor={solicitud.fechaSolicitud}
                />

                <DatoCotizacion
                  etiqueta="Fecha Entrega"
                  valor={solicitud.fechaEntrega}
                />

              </dl>

              <dl className="cotizar-lista">

                <DatoCotizacion
                  etiqueta="Email"
                  valor={solicitud.email}
                />

                <DatoCotizacion
                  etiqueta="Teléfono"
                  valor={solicitud.telefono}
                />

                <DatoCotizacion
                  etiqueta="Cont. Preferido"
                  valor={solicitud.contactarPor}
                />

              </dl>

            </div>

            {/* DESCRIPCIÓN */}

            <div className="cotizar-descripcion">

              <h4>Descripción</h4>

              <p>
                {solicitud.descripcion ||
                  'No hay una descripción registrada.'}
              </p>

            </div>

            {/* ESTADO */}

            <div className="cotizar-estado-fila">

              <strong>Estado:</strong>

              <span className="cotizar-estado">
                {solicitud.estado}
              </span>

            </div>

          </article>

          {/* ==================================
              FORMULARIO DE COTIZACIÓN
          ================================== */}

          <form
            className="cotizar-formulario"
            onSubmit={enviarCotizacion}
          >

            <h3>Enviar cotización</h3>

            {/* MENSAJE */}

            <div className="cotizar-campo">

              <label htmlFor="cotizar-mensaje">
                Mensaje para el cliente
              </label>

              <textarea
                id="cotizar-mensaje"
                value={mensaje}
                rows={6}
                required
                placeholder="Escribe un mensaje personalizado para el cliente..."
                onChange={(evento) => {
                  setMensaje(evento.target.value)
                  setAviso('')
                }}
              />

            </div>

            {/* ARCHIVO PDF */}

            <div className="cotizar-campo">

              <label htmlFor="cotizar-archivo">
                Adjuntar cotización PDF
              </label>

              <div className="cotizar-archivo-control">

                <FaPaperclip aria-hidden="true" />

                <input
                  ref={archivoRef}
                  id="cotizar-archivo"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={seleccionarArchivo}
                />

              </div>

              <span className="cotizar-ayuda">
                Formato permitido: PDF.
              </span>

              {errorArchivo && (
                <p className="cotizar-error" role="alert">
                  {errorArchivo}
                </p>
              )}

              {/* ARCHIVO SELECCIONADO */}

              {archivo && (

                <div className="cotizar-archivo-seleccionado">

                  <div className="cotizar-archivo-nombre">

                    <FaPaperclip aria-hidden="true" />

                    <span>{archivo.name}</span>

                  </div>

                  <button
                    type="button"
                    aria-label="Quitar PDF adjunto"
                    onClick={quitarArchivo}
                  >
                    <FaXmark aria-hidden="true" />
                  </button>

                </div>

              )}

            </div>

            {/* AVISO DE VALIDACIÓN */}

            {aviso && (
              <p
                className="cotizar-aviso"
                role="status"
              >
                {aviso}
              </p>
            )}

            {/* BOTONES */}

            <div className="cotizar-acciones">

              <Link
                to="/admin/cotizaciones"
                className="cotizar-cancelar"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                className="cotizar-enviar"
              >
                Enviar cotización
              </button>

            </div>

          </form>

        </section>

        <div
          className="perfil-puntos"
          aria-hidden="true"
        />

      </div>

    </main>
  )
}

export default CotizarSolicitud
