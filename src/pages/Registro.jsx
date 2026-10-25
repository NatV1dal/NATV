
import { useState } from 'react'
import { Link } from 'react-router-dom'

import {
  FaUser,
  FaEnvelope,
  FaLock
} from 'react-icons/fa6'

import './Login.css'
import './Registro.css'

const formularioInicial = {
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  confirmarPassword: ''
}

function Registro() {

  const [formulario, setFormulario] = useState(formularioInicial)
  const [error, setError] = useState('')
  const [mostrarAviso, setMostrarAviso] = useState(false)

  // Actualizar los campos
  function manejarCambio(evento) {
    const { name, value } = evento.target

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }))

    setError('')
    setMostrarAviso(false)
  }

  // Validar formulario
  function registrarUsuario(evento) {
    evento.preventDefault()

    if (formulario.password !== formulario.confirmarPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    // Registro real pendiente de conectar con la API
    setError('')
    setMostrarAviso(true)
  }

  return (
    <main className="login-pagina registro-pagina">

      {/* Fondo azul decorativo */}
      <div
        className="login-fondo-azul"
        aria-hidden="true"
      />

      <div className="login-contenedor">

        {/* Marco celeste */}
        <div
          className="login-marco-celeste"
          aria-hidden="true"
        />

        {/* Panel de navegación */}
        <aside className="login-panel-lateral">
 
        <nav
        className="login-pestanas"
        aria-label="Acceso de usuarios"
        >
        <Link
            to="/login"
            className="login-pestana"
        >
            Login
        </Link>

        <Link
            to="/registro"
            className="login-pestana activa"
            aria-current="page"
        >
            Registro
        </Link>
        </nav>


        </aside>

        {/* Tarjeta blanca */}
        <section className="login-tarjeta">

          <div className="login-formulario-contenido">

            <h1 className="visually-hidden">
              Registro de usuarios
            </h1>

            <form onSubmit={registrarUsuario}>

              {/* Nombre */}
              <div className="login-campo">

                <span className="login-campo-icono">
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
              <div className="login-campo">

                <span className="login-campo-icono">
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

              {/* Correo electrónico */}
              <div className="login-campo">

                <span className="login-campo-icono">
                  <FaEnvelope aria-hidden="true" />
                </span>

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  aria-label="Correo electrónico"
                  autoComplete="email"
                  value={formulario.email}
                  onChange={manejarCambio}
                  required
                />

              </div>

              {/* Contraseña */}
              <div className="login-campo">

                <span className="login-campo-icono">
                  <FaLock aria-hidden="true" />
                </span>

                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  aria-label="Contraseña"
                  autoComplete="new-password"
                  minLength={8}
                  value={formulario.password}
                  onChange={manejarCambio}
                  required
                />

              </div>

              {/* Confirmar contraseña */}
              <div className="login-campo">

                <span className="login-campo-icono">
                  <FaLock aria-hidden="true" />
                </span>

                <input
                  type="password"
                  name="confirmarPassword"
                  placeholder="Confirmar Contraseña"
                  aria-label="Confirmar contraseña"
                  autoComplete="new-password"
                  minLength={8}
                  value={formulario.confirmarPassword}
                  onChange={manejarCambio}
                  required
                />

              </div>

              {/* Botón de registro */}
              <button
                type="submit"
                className="login-boton"
              >
                Registrarse
              </button>

              {/* Mensaje informativo */}
              <p className="registro-descripcion">
                Al registrarte podrás solicitar servicios
                y ver el estado de tus solicitudes.
              </p>

              {/* Error de validación */}
              {error && (
                <p className="registro-error" role="alert">
                  {error}
                </p>
              )}

              {/* Aviso provisional */}
              {mostrarAviso && (
                <p className="login-aviso" role="status">
                  El formulario es válido. El registro
                  estará disponible cuando conectemos
                  la autenticación con el backend.
                </p>
              )}

            </form>

          </div>

        </section>

      </div>

      {/* Puntos decorativos */}
      <div
        className="login-puntos"
        aria-hidden="true"
      />

    </main>
  )
}

export default Registro
