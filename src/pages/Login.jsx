
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock } from 'react-icons/fa6'

import './Login.css'

// Dirección del backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function Login() {

  const navigate = useNavigate()

  // Datos del formulario
  const [formulario, setFormulario] = useState({
    correo: '',
    password: ''
  })

  // Estados del inicio de sesión
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  // ==================================
  // ACTUALIZAR CAMPOS
  // ==================================

  function manejarCambio(evento) {
    const { name, value } = evento.target

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }))

    setError('')
  }

  // ==================================
  // INICIAR SESIÓN
  // ==================================

  async function iniciarSesion(evento) {
    evento.preventDefault()

    setCargando(true)
    setError('')

    try {
      const respuesta = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formulario.correo.trim(),
          password: formulario.password
        })
      })

      const datos = await respuesta.json()

      // Comprobar respuesta del servidor
      if (!respuesta.ok) {
        throw new Error(
          datos.message || 'No fue posible iniciar sesión.'
        )
      }

      // Comprobar que recibimos el token
      if (!datos.token) {
        throw new Error(
          'El servidor no devolvió un token de sesión.'
        )
      }

      // Guardar token durante la sesión de la pestaña
      sessionStorage.setItem('natv_token', datos.token)

      
 // Redirigir al perfil del cliente
 navigate('/perfil', { replace: true })


    } catch (error) {
      setError(
        error.message || 'No fue posible conectar con el servidor.'
      )

    } finally {
      setCargando(false)
    }
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
          <nav
            className="login-pestanas"
            aria-label="Acceso de usuarios"
          >
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

              {/* Correo */}
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
                  autoComplete="current-password"
                  value={formulario.password}
                  onChange={manejarCambio}
                  required
                />
              </div>

              {/* Botón */}
              <button
                type="submit"
                className="login-boton"
                disabled={cargando}
              >
                {cargando ? 'Ingresando...' : 'Iniciar Sesión'}
              </button>

              {/* Recuperar contraseña */}
              <Link
                to="/recuperar-contrasena"
                className="login-recuperar"
              >
                ¿Olvidaste tu contraseña?
              </Link>

              {/* Mensajes de error */}
              {error && (
                <p
                  className="login-aviso"
                  role="alert"
                >
                  {error}
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
