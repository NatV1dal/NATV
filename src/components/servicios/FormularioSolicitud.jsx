
import { useState } from 'react'
import './FormularioSolicitud.css'

// ==================================
// VALORES INICIALES DEL FORMULARIO
// ==================================

const formularioInicial = {
  nombre: '',
  correo: '',
  telefono: '',
  contacto: '',
  urgencia: '',
  mensaje: '',
  referencias: ''
}

function FormularioSolicitud({ servicio }) {

  // Guardar los datos que escribe el usuario
  const [formulario, setFormulario] = useState(formularioInicial)

  // ==================================
  // ACTUALIZAR CAMPOS
  // ==================================

  function manejarCambio(evento) {
    const { name, value } = evento.target

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }))
  }

  // ==================================
  // VALIDAR ENLACES DE REFERENCIA
  // ==================================

  function validarReferencias() {

    // Cada línea corresponde a un enlace
    const enlaces = formulario.referencias
      .split('\n')
      .map((enlace) => enlace.trim())
      .filter(Boolean)

    // El campo es opcional
    if (enlaces.length === 0) {
      return true
    }

    // Verificar que cada enlace sea una URL válida
    for (const enlace of enlaces) {
      try {
        const url = new URL(enlace)

        if (
          url.protocol !== 'https:' &&
          url.protocol !== 'http:'
        ) {
          return false
        }

      } catch {
        return false
      }
    }

    return true
  }

  // ==================================
  // LIMPIAR FORMULARIO
  // ==================================

  function borrarSolicitud() {
    setFormulario({ ...formularioInicial })
  }

  // ==================================
  // ENVIAR SOLICITUD
  // ==================================

  function enviarSolicitud(evento) {
    evento.preventDefault()

    // Comprobar enlaces si el usuario agregó alguno
    if (!validarReferencias()) {
      alert(
        'Por favor, ingresa enlaces válidos que comiencen ' +
        'con https:// o http://, uno por línea.'
      )
      return
    }

    // Envío provisional: pendiente de integración con backend
    alert(
      `Formulario de "${servicio.nombre}" completado. ` +
      'Para enviar la solicitud será necesario iniciar sesión. ' +
      'El envío real todavía no está habilitado.'
    )
  }

  return (
    <section className="formulario-solicitud">

      <h2>Formulario de solicitud</h2>

      <form
        onSubmit={enviarSolicitud}
        onReset={borrarSolicitud}
      >

        {/* Nombre */}
        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          aria-label="Nombre completo"
          autoComplete="name"
          value={formulario.nombre}
          onChange={manejarCambio}
          required
        />

        {/* Correo */}
        <input
          type="email"
          name="correo"
          placeholder="Correo electrónico"
          aria-label="Correo electrónico"
          autoComplete="email"
          value={formulario.correo}
          onChange={manejarCambio}
          required
        />

        {/* Teléfono */}
        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono de contacto"
          aria-label="Teléfono de contacto"
          autoComplete="tel"
          value={formulario.telefono}
          onChange={manejarCambio}
          required
        />

        {/* Medio de contacto */}
        <select
          name="contacto"
          aria-label="Medio de contacto preferido"
          value={formulario.contacto}
          onChange={manejarCambio}
          required
        >
          <option value="" disabled>
            Contactar por
          </option>

          <option value="correo">
            Correo electrónico
          </option>

          <option value="telefono">
            Teléfono
          </option>

          <option value="whatsapp">
            WhatsApp
          </option>
        </select>

        {/* Urgencia */}
        <select
          name="urgencia"
          aria-label="Urgencia del servicio"
          value={formulario.urgencia}
          onChange={manejarCambio}
          required
        >
          <option value="" disabled>
            Elija la urgencia de su servicio
          </option>

          <option value="baja">
            Sin urgencia
          </option>

          <option value="media">
            Normal
          </option>

          <option value="alta">
            Urgente
          </option>
        </select>

        {/* Descripción */}
        <textarea
          name="mensaje"
          placeholder="Detalla qué necesitas, las ideas que tienes y cuál es tu público objetivo"
          aria-label="Descripción de la solicitud"
          rows={5}
          value={formulario.mensaje}
          onChange={manejarCambio}
          required
        />

        {/* Enlaces de referencia */}
        <div className="formulario-solicitud-referencias">

          <label htmlFor="referencias">
            Enlaces de referencia (opcional)
          </label>

          <textarea
            id="referencias"
            name="referencias"
            placeholder={
              "https://www.behance.net/...\nhttps://www.pinterest.com/..."
            }
            aria-label="Enlaces de referencia"
            rows={3}
            value={formulario.referencias}
            onChange={manejarCambio}
          />

          <small>
            Puedes compartir enlaces de inspiración,
            uno por línea.
          </small>

        </div>

        {/* Botones */}
        <div className="formulario-solicitud-acciones">

          <button
            type="reset"
            className="formulario-borrar"
          >
            Borrar solicitud
          </button>

          <button
            type="submit"
            className="formulario-enviar"
          >
            Enviar solicitud
          </button>

        </div>

      </form>

      <p className="formulario-solicitud-aviso">
        Te contactaremos para confirmar los detalles
        y enviarte una cotización.
      </p>

    </section>
  )
}

export default FormularioSolicitud
