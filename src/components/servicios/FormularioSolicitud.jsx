
import { useRef, useState } from 'react'
import { FaImages } from 'react-icons/fa6'
import './FormularioSolicitud.css'

const formularioInicial = {
  nombre: '',
  correo: '',
  telefono: '',
  contacto: '',
  urgencia: '',
  mensaje: ''
}

function FormularioSolicitud({ servicio }) {

  // Guardar los datos que escribe el usuario
  const [formulario, setFormulario] = useState(formularioInicial)

  // Guardar las imágenes seleccionadas
  const [archivos, setArchivos] = useState([])

  // Referencia al campo de archivos
  const archivoInputRef = useRef(null)

  // Actualizar un campo del formulario
  function manejarCambio(evento) {
    const { name, value } = evento.target

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }))
  }

  // Seleccionar archivos
  function manejarArchivos(evento) {
    const seleccionados = Array.from(evento.target.files)

    setArchivos(seleccionados)
  }

  // Limpiar el formulario
  function borrarSolicitud() {
    setFormulario({ ...formularioInicial })
    setArchivos([])

    if (archivoInputRef.current) {
      archivoInputRef.current.value = ''
    }
  }

  // Envío provisional
  function enviarSolicitud(evento) {
    evento.preventDefault()

    // La autenticación y el backend se agregarán después
    alert(
      `Formulario de "${servicio.nombre}" completado. ` +
      'Para enviar la solicitud será necesario iniciar sesión. ' +
      'El envío real todavía no está habilitado.'
    )
  }

  return (
    <section className="formulario-solicitud">

      <h2>Formulario de solicitud</h2>

      <form onSubmit={enviarSolicitud} onReset={borrarSolicitud}>

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
          <option value="correo">Correo electrónico</option>
          <option value="telefono">Teléfono</option>
          <option value="whatsapp">WhatsApp</option>
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
          <option value="baja">Sin urgencia</option>
          <option value="media">Normal</option>
          <option value="alta">Urgente</option>
        </select>

        {/* Descripción */}
        <textarea
          name="mensaje"
          placeholder="Detalle qué necesitas, las ideas que tienes y cuál es tu público objetivo"
          aria-label="Descripción de la solicitud"
          rows="5"
          value={formulario.mensaje}
          onChange={manejarCambio}
          required
        />

        {/* Archivos de referencia */}
        <label className="formulario-solicitud-archivo">
          <span>
            {archivos.length > 0
              ? `${archivos.length} archivo(s) seleccionado(s)`
              : '¿Tienes alguna imagen de referencia?'}
          </span>

          <FaImages aria-hidden="true" />

          <input
            ref={archivoInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={manejarArchivos}
            aria-label="Adjuntar imágenes de referencia"
          />
        </label>

        {/* Botones */}
        <div className="formulario-solicitud-acciones">

          <button type="reset" className="formulario-borrar">
            Borrar solicitud
          </button>

          <button type="submit" className="formulario-enviar">
            Enviar solicitud
          </button>

        </div>

      </form>

      <p className="formulario-solicitud-aviso">
        Te contactaremos para confirmar los detalles y enviarte
        una cotización.
      </p>

    </section>
  )
}

export default FormularioSolicitud
