import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaEnvelope, FaLock } from 'react-icons/fa6'

import './Login.css'

function Login() {
  const [formulario, setFormulario] = useState({
    correo: '',
    password: ''
  })

  const [mostrarAviso, setMostrarAviso] = useState(false)

  function manejarCambio(evento) {
    const { name, value } = evento.target

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }))

    setMostrarAviso(false)
  }

  function iniciarSesion(evento) {
    evento.preventDefault()
    setMostrarAviso(true)
  }

  return (
    <main className="login-pagina">
      {/* Fondo azul decorativo */}
      <div
        className="login-fondo-azul"
        aria-hidden="true"
      />

      <div className="login-contenedor">
        {/* Marco celeste decorativo */}
        <div
          className="login-marco-celeste"
          aria-hidden="true"
        />

        {/* Panel lateral */}
        <aside className="login-panel-lateral">
          <nav className="login-pestanas" aria-label="Acceso de usuarios">
            <Link
              to="/login"
              className="login-pestana activa"
              aria-current="page"
            >
              Login
            </Link>

            <Link
              to="/registro"
              className="login-pestana"
            >
              Registro
            </Link>
          </nav>
        </aside>

        {/* Formulario */}
        <section className="login-tarjeta">
          <div className="login-formulario-contenido">
            <h1 className="visually-hidden">
              Iniciar sesión
            </h1>

            <form onSubmit={iniciarSesion}>
              <div className="login-campo">
                <span className="login-campo-icono">
                  <FaEnvelope aria-hidden="true" />
                </span>

                <input
                  type="email"
                  name="correo"
                  placeholder="Email"
                  aria-label="Correo electrónico"
                  autoComplete="email"
                  value={formulario.correo}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="login-campo">
                <span className="login-campo-icono">
                  <FaLock aria-hidden="true" />
                </span>

                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  aria-label="Contraseña"
                  autoComplete="current-password"
                  value={formulario.password}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <button
                type="submit"
                className="login-boton"
              >
                Iniciar Sesión
              </button>

              <Link
                to="/recuperar-contrasena"
                className="login-recuperar"
              >
                ¿Olvidaste tu contraseña?
              </Link>

              {mostrarAviso && (
                <p
                  className="login-aviso"
                  role="status"
                >
                  El inicio de sesión estará disponible
                  cuando conectemos la autenticación.
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

export default Login