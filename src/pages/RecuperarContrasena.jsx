
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaEnvelope,
  FaLock,
  FaKey
} from 'react-icons/fa6'

import './Login.css'
import './RecuperarContrasena.css'

// Código provisional para probar el frontend.
// Se reemplazará por la validación de la API.
const CODIGO_DEMO = '123456'

function RecuperarContrasena() {

  const [paso, setPaso] = useState(1)

  const [formulario, setFormulario] = useState({
    email: '',
    codigo: '',
    nuevaPassword: '',
    confirmarPassword: ''
  })

  const [error, setError] = useState('')
  const [aviso, setAviso] = useState('')
  const [completado, setCompletado] = useState(false)

  // Actualizar campos
  function manejarCambio(evento) {
    const { name, value } = evento.target

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }))

    setError('')
  }

  // Paso 1: solicitar código
  function enviarCodigo(evento) {
    evento.preventDefault()

    if (!formulario.email.trim()) {
      setError('Ingresa tu correo electrónico.')
      return
    }

    setError('')
    setAviso(
      'Modo demostración: no se envió un correo. Utiliza el código 123456 para continuar.'
    )
    setPaso(2)
  }

  // Paso 2: validar código
  function validarCodigo(evento) {
    evento.preventDefault()

    if (formulario.codigo !== CODIGO_DEMO) {
      setError('El código ingresado no es válido.')
      return
    }

    setError('')
    setAviso('')
    setPaso(3)
  }

  // Reenviar código (simulación)
  function reenviarCodigo() {
    setFormulario((anterior) => ({
      ...anterior,
      codigo: ''
    }))

    setError('')
    setAviso(
      'Modo demostración: no se envió un correo. El código de prueba sigue siendo 123456.'
    )
  }

  // Paso 3: nueva contraseña
  function cambiarPassword(evento) {
    evento.preventDefault()

    if (formulario.nuevaPassword.length < 8) {
      setError(
        'La contraseña debe tener al menos 8 caracteres.'
      )
      return
    }

    if (
      formulario.nuevaPassword !==
      formulario.confirmarPassword
    ) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setError('')
    setAviso('')
    setCompletado(true)
  }

  return (
    <main className="login-pagina recuperacion-pagina">

      {/* Fondo azul */}
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

        {/* Panel lateral */}
        <aside className="login-panel-lateral">

          <nav
            className="login-pestanas"
            aria-label="Acceso de usuarios"
          >

            <Link
              to="/login"
              className="login-pestana activa"
            >
              Login
            </Link>

          </nav>

        </aside>

        {/* Tarjeta blanca */}
        <section className="login-tarjeta">

          <div className="login-formulario-contenido">

            <h1 className="recuperacion-titulo">
              Restablecer contraseña
            </h1>

            {/* Indicador de pasos */}
            <div
              className="recuperacion-pasos"
              aria-label={`Paso ${paso} de 3`}
            >

              {[1, 2, 3].map((numero) => (

                <span
                  key={numero}
                  className={
                    paso === numero
                      ? 'recuperacion-paso activo'
                      : 'recuperacion-paso'
                  }
                  aria-current={
                    paso === numero
                      ? 'step'
                      : undefined
                  }
                >
                  Paso {numero}
                </span>

              ))}

            </div>

            {/* Contenido animado */}
            <div
              key={paso}
              className="recuperacion-contenido-paso"
            >

              {/* ======================
                  PASO 1 - CORREO
              ====================== */}

              {paso === 1 && (

                <form onSubmit={enviarCodigo}>

                  <p className="recuperacion-instruccion">
                    Ingresa el correo asociado a tu cuenta
                  </p>

                  <div className="login-campo">

                    <span className="login-campo-icono">
                      <FaEnvelope aria-hidden="true" />
                    </span>

                    <input
                      type="email"
                      name="email"
                      placeholder="Ingresar correo"
                      aria-label="Correo electrónico"
                      autoComplete="email"
                      value={formulario.email}
                      onChange={manejarCambio}
                      required
                    />

                  </div>

                  <button
                    type="submit"
                    className="login-boton"
                  >
                    Enviar código de verificación
                  </button>

                </form>

              )}

              {/* ======================
                  PASO 2 - CÓDIGO
              ====================== */}

              {paso === 2 && (

                <form onSubmit={validarCodigo}>

                  <p className="recuperacion-instruccion">
                    Ingresa el código de verificación
                    enviado a tu correo
                  </p>

                  <div className="login-campo">

                    <span className="login-campo-icono">
                      <FaKey aria-hidden="true" />
                    </span>

                    <input
                      type="text"
                      name="codigo"
                      placeholder="Ingresar código"
                      aria-label="Código de verificación"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      value={formulario.codigo}
                      onChange={manejarCambio}
                      required
                    />

                  </div>

                  <button
                    type="submit"
                    className="login-boton"
                  >
                    Validar
                  </button>

                  <button
                    type="button"
                    className="recuperacion-enlace"
                    onClick={reenviarCodigo}
                  >
                    ¿No recibiste el código? Reenviar
                  </button>

                </form>

              )}

              {/* ======================
                  PASO 3 - CONTRASEÑA
              ====================== */}

              {paso === 3 && !completado && (

                <form onSubmit={cambiarPassword}>

                  <p className="recuperacion-instruccion">
                    Ingresa tu nueva contraseña
                  </p>

                  <div className="login-campo">

                    <span className="login-campo-icono">
                      <FaLock aria-hidden="true" />
                    </span>

                    <input
                      type="password"
                      name="nuevaPassword"
                      placeholder="Crear Nueva Contraseña"
                      aria-label="Nueva contraseña"
                      autoComplete="new-password"
                      minLength={8}
                      value={formulario.nuevaPassword}
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
                      name="confirmarPassword"
                      placeholder="Confirmar Nueva Contraseña"
                      aria-label="Confirmar nueva contraseña"
                      autoComplete="new-password"
                      minLength={8}
                      value={formulario.confirmarPassword}
                      onChange={manejarCambio}
                      required
                    />

                  </div>

                  <button
                    type="submit"
                    className="login-boton"
                  >
                    Confirmar nueva contraseña
                  </button>

                  <Link
                    to="/login"
                    className="recuperacion-enlace"
                  >
                    Volver al Login
                  </Link>

                </form>

              )}

              {/* Validación completada */}
              {paso === 3 && completado && (

                <div className="recuperacion-final">

                  <p>
                    ¡Formulario validado correctamente!
                  </p>

                  <p>
                    Esta es una demostración.
                    La contraseña todavía no se
                    ha actualizado en la base de datos.
                  </p>

                  <Link
                    to="/login"
                    className="recuperacion-enlace"
                  >
                    Volver al Login
                  </Link>

                </div>

              )}

              {/* Errores */}
              {error && (
                <p
                  className="recuperacion-error"
                  role="alert"
                >
                  {error}
                </p>
              )}

              {/* Avisos */}
              {aviso && (
                <p
                  className="recuperacion-aviso"
                  role="status"
                >
                  {aviso}
                </p>
              )}

            </div>

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

export default RecuperarContrasena
