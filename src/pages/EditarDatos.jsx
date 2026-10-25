
import { useState } from 'react'
import {
  FaUser,
  FaPhone,
  FaLock
} from 'react-icons/fa6'

import './PerfilCliente.css'
import './EditarDatos.css'

const datosIniciales = {
  nombre: 'Ariel',
  apellido: '',
  telefono: '',
  nuevaPassword: '',
  confirmarPassword: ''
}

function EditarDatos() {

  const [formulario, setFormulario] = useState(datosIniciales)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  // Actualizar campos
  function manejarCambio(evento) {
    const { name, value } = evento.target

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }))

    setError('')
    setMensaje('')
  }

  // Validar edición
  function guardarDatos(evento) {
    evento.preventDefault()

    const {
      nombre,
      apellido,
      telefono,
      nuevaPassword,
      confirmarPassword
    } = formulario

    if (!nombre.trim() || !apellido.trim()) {
      setError('Debes ingresar tu nombre y apellido.')
      return
    }

    const telefonoLimpio = telefono.replace(/[\s()-]/g, '')

    if (
      telefonoLimpio &&
      !/^\+?[0-9]{8,15}$/.test(telefonoLimpio)
    ) {
      setError('Ingresa un número de teléfono válido.')
      return
    }

    // Cambiar contraseña es opcional
    const quiereCambiarPassword =
      nuevaPassword !== '' || confirmarPassword !== ''

    if (quiereCambiarPassword) {

      if (nuevaPassword.length < 8) {
        setError(
          'La nueva contraseña debe tener al menos 8 caracteres.'
        )
        return
      }

      if (nuevaPassword !== confirmarPassword) {
        setError('Las contraseñas no coinciden.')
        return
      }
    }

    setError('')

    // No guardamos contraseñas en el navegador.
    setFormulario((anterior) => ({
      ...anterior,
      nuevaPassword: '',
      confirmarPassword: ''
    }))

    setMensaje(
      'Formulario validado correctamente. Los cambios se guardarán cuando conectemos el backend.'
    )
  }

  return (
    <main className="perfil-pagina editar-pagina">

      <div className="perfil-contenedor">

        <section className="perfil-bienvenida editar-panel">

          {/* Encabezado */}
          <div className="perfil-bienvenida-texto">

            <h1>
              ¡Hola, {formulario.nombre || 'Usuario'}!
            </h1>

            <p>
              Administra y actualiza la información
              personal de tu cuenta NATV.
            </p>

          </div>

          {/* Fotografía de perfil */}
          <div className="perfil-avatar-marco">

            <div className="perfil-avatar">
              <FaUser aria-label="Avatar predeterminado" />
            </div>

          </div>

          {/* Formulario */}
          <form
            className="editar-formulario"
            onSubmit={guardarDatos}
          >

            {/* Nombre */}
            <div className="editar-campo">

              <span className="editar-campo-icono">
                <FaUser aria-hidden="true" />
              </span>

              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                aria-label="Nombre"
                autoComplete="given-name"
                value={formulario.nombre}
                onChange={manejarCambio}
                required
              />

            </div>

            {/* Apellido */}
            <div className="editar-campo">

              <span className="editar-campo-icono">
                <FaUser aria-hidden="true" />
              </span>

              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                aria-label="Apellido"
                autoComplete="family-name"
                value={formulario.apellido}
                onChange={manejarCambio}
                required
              />

            </div>

            {/* Teléfono */}
            <div className="editar-campo">

              <span className="editar-campo-icono">
                <FaPhone aria-hidden="true" />
              </span>

              <input
                type="tel"
                name="telefono"
                placeholder="Teléfono"
                aria-label="Teléfono"
                autoComplete="tel"
                value={formulario.telefono}
                onChange={manejarCambio}
              />

            </div>

            {/* Nueva contraseña */}
            <div className="editar-campo">

              <span className="editar-campo-icono">
                <FaLock aria-hidden="true" />
              </span>

              <input
                type="password"
                name="nuevaPassword"
                placeholder="Cambiar Contraseña"
                aria-label="Nueva contraseña"
                autoComplete="new-password"
                minLength={8}
                value={formulario.nuevaPassword}
                onChange={manejarCambio}
              />

            </div>

            {/* Confirmar contraseña */}
            <div className="editar-campo">

              <span className="editar-campo-icono">
                <FaLock aria-hidden="true" />
              </span>

              <input
                type="password"
                name="confirmarPassword"
                placeholder="Confirmar Nueva Contraseña"
                aria-label="Confirmar nueva contraseña"
                autoComplete="new-password"
                value={formulario.confirmarPassword}
                onChange={manejarCambio}
              />

            </div>

            {/* Mensajes */}
            {error && (
              <p className="editar-error" role="alert">
                {error}
              </p>
            )}

            {mensaje && (
              <p className="editar-mensaje" role="status">
                {mensaje}
              </p>
            )}

            {/* Guardar */}
            <div className="editar-acciones">

              <button
                type="submit"
                className="editar-guardar"
              >
                Guardar datos
              </button>

            </div>

          </form>

        </section>

        {/* Puntos decorativos */}
        <div
          className="perfil-puntos"
          aria-hidden="true"
        />

      </div>

    </main>
  )
}

export default EditarDatos
