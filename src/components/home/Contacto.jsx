
import { useState } from 'react'
import './Contacto.css'

// Íconos de contacto
import iconoTelefono from '../../assets/icons/telefono.svg'
import iconoCorreo from '../../assets/icons/correo.svg'


// Íconos de redes sociales
import {
  FaBehance,
  FaGithub,
  FaInstagram,
  FaWhatsapp,
  FaLinkedin
} from 'react-icons/fa6'

function Contacto() {

  // Datos del formulario
  const [formulario, setFormulario] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    mensaje: ''
  })

  // Actualizar los campos
  const manejarCambio = (e) => {
    const { name, value } = e.target

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }))
  }

  // Validar el formulario (sin envío al backend)
  const manejarEnvio = (e) => {
    e.preventDefault()

    alert(
      'Formulario validado. El envío estará disponible cuando conectemos el backend.'
    )
  }

  return (
    <section id="contacto" className="contacto-natv">
      <div className="container">

        {/* ===== ENCABEZADO ===== */}

        <div className="contacto-encabezado">

          <span className="contacto-etiqueta">
            CONTACTO
          </span>

          <h2>
            Contáctame a través de estos medios
          </h2>

          <p>
            ¿Tienes una idea o proyecto en mente?
            Cuéntame sobre él y conversemos para
            encontrar la mejor forma de hacerlo realidad.
          </p>

        </div>

        {/* ===== CONTENIDO ===== */}

        <div className="contacto-contenido">

          {/* ===== FORMULARIO ===== */}

          <div className="contacto-formulario-fondo">

            <form
              className="contacto-formulario"
              onSubmit={manejarEnvio}
            >

              <div className="contacto-fila">

                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  aria-label="Nombre"
                  value={formulario.nombre}
                  onChange={manejarCambio}
                  required
                />

                <input
                  type="text"
                  name="apellido"
                  placeholder="Apellido"
                  aria-label="Apellido"
                  value={formulario.apellido}
                  onChange={manejarCambio}
                  required
                />

              </div>

              <input
                type="email"
                name="correo"
                placeholder="Correo"
                aria-label="Correo"
                value={formulario.correo}
                onChange={manejarCambio}
                required
              />

              <textarea
                name="mensaje"
                placeholder="Mensaje"
                aria-label="Mensaje"
                value={formulario.mensaje}
                onChange={manejarCambio}
                rows="5"
                required
              />

              <button type="submit">
                Enviar Mensaje
              </button>

            </form>

          </div>

          {/* ===== MEDIOS DE CONTACTO ===== */}

          <div className="contacto-medios">

            {/* Teléfono y correo */}

            <div className="contacto-medios-principales">

              <div className="contacto-item">

                <h3>Teléfono</h3>

                <a
                  href="tel:+56971729407"
                  className="contacto-icono"
                  aria-label="Llamar a NATV"
                >
 
                  <img
                    src={iconoTelefono}
                    alt=""
                    aria-hidden="true"
                  />

                </a>

              </div>

              <div className="contacto-item">

                <h3>Correo</h3>

                <a
                  href="mailto:tu-correo@ejemplo.com"
                  className="contacto-icono"
                  aria-label="Enviar correo a NATV"
                >
                  <img
                    src={iconoCorreo}
                    alt=""
                    aria-hidden="true"
                  />
                </a>

              </div>

            </div>

            {/* ===== REDES SOCIALES ===== */}

            <div className="contacto-redes-bloque">

              <h3>Redes Sociales</h3>

              <div className="contacto-redes">

                {/* Behance */}
                <a
                  href="https://www.behance.net/natalievidal"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Behance de NATV"
                >
                  <FaBehance />
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/NatV1dal"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub de NATV"
                >
                  <FaGithub />
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/natv.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram de NATV"
                >
                  <FaInstagram />
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/56971729407"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contactar a NATV por WhatsApp"
                >
                  <FaWhatsapp />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/natalie-vidal-aldea/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn de Natalie Vidal Aldea"
                >
                  <FaLinkedin />
                </a>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  )
}

export default Contacto
