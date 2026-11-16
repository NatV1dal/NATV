
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUser, FaPhone, FaLock } from 'react-icons/fa6'

import './PerfilCliente.css'
import './EditarDatos.css'

// ==================================
// CONFIGURACIÓN API
// ==================================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// ==================================
// DATOS INICIALES DEL FORMULARIO
// ==================================

const datosIniciales = {
  nombre: '',
  apellido: '',
  telefono: '',
  passwordActual: '',
  nuevaPassword: '',
  confirmarPassword: ''
}

function EditarDatos() {

  const navigate = useNavigate()

  // ==================================
  // ESTADOS DEL FORMULARIO
  // ==================================

  const [formulario, setFormulario] = useState(datosIniciales)

  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  const [cargandoDatos, setCargandoDatos] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [guardando, setGuardando] = useState(false)

  // ==================================
  // CARGAR DATOS DEL USUARIO
  // ==================================

  useEffect(() => {

    const token = sessionStorage.getItem('natv_token')

    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    const controller = new AbortController()

    async function cargarUsuario() {

      try {

        const respuesta = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          signal: controller.signal
        })

        // Sesión vencida o inválida
        if (respuesta.status === 401) {
          sessionStorage.removeItem('natv_token')
          navigate('/login', { replace: true })
          return
        }

        if (!respuesta.ok) {
          throw new Error('No fue posible obtener tus datos.')
        }

        const datos = await respuesta.json()

        // Comprobar el rol
        if (
          datos.user?.rol !== 'cliente' &&
          datos.user?.rol !== 'administrador'
        ) {
          throw new Error(
            'No tienes permisos para editar esta cuenta.'
          )
        }

        // Cargar los datos reales desde PostgreSQL
        setFormulario({
          nombre: datos.user.nombre ?? '',
          apellido: datos.user.apellido ?? '',
          telefono: datos.user.telefono ?? '',
          passwordActual: '',
          nuevaPassword: '',
          confirmarPassword: ''
        })

      } catch (error) {

        if (error.name !== 'AbortError') {
          setErrorCarga(
            error.message || 'No fue posible cargar tus datos.'
          )
        }

      } finally {

        if (!controller.signal.aborted) {
          setCargandoDatos(false)
        }

      }
    }

    cargarUsuario()

    return () => controller.abort()

  }, [navigate])

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
    setMensaje('')
  }

  // ==================================
  // GUARDAR DATOS EN POSTGRESQL
  // ==================================

  async function guardarDatos(evento) {

    evento.preventDefault()

    const {
      nombre,
      apellido,
      telefono,
      passwordActual,
      nuevaPassword,
      confirmarPassword
    } = formulario

    setError('')
    setMensaje('')

    // ==================================
    // VALIDAR NOMBRE Y APELLIDO
    // ==================================

    if (!nombre.trim() || !apellido.trim()) {
      setError('Debes ingresar tu nombre y apellido.')
      return
    }

    if (
      nombre.trim().length > 50 ||
      apellido.trim().length > 50
    ) {
      setError(
        'El nombre y apellido no pueden superar los 50 caracteres.'
      )
      return
    }

    // ==================================
    // VALIDAR TELÉFONO
    // ==================================

    const telefonoLimpio = telefono.replace(/[\s()-]/g, '')

    if (
      telefonoLimpio &&
      !/^\+?[0-9]{8,15}$/.test(telefonoLimpio)
    ) {
      setError('Ingresa un número de teléfono válido.')
      return
    }

    // ==================================
    // VALIDAR CAMBIO DE CONTRASEÑA
    // ==================================

    const quiereCambiarPassword =
      passwordActual !== '' ||
      nuevaPassword !== '' ||
      confirmarPassword !== ''

    if (quiereCambiarPassword) {

      if (!passwordActual) {
        setError('Debes ingresar tu contraseña actual.')
        return
      }

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

    // ==================================
    // VERIFICAR SESIÓN
    // ==================================

    const token = sessionStorage.getItem('natv_token')

    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    // ==================================
    // ENVIAR DATOS AL BACKEND
    // ==================================

    setGuardando(true)

    try {

      const respuesta = await fetch(`${API_URL}/api/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          telefono: telefonoLimpio,

          // Solo enviar contraseñas si se quiere cambiarlas
          ...(quiereCambiarPassword && {
            passwordActual,
            nuevaPassword
          })
        })
      })

      // Si no se cambió contraseña, un 401 indica
      // que la sesión ya no es válida.
      if (respuesta.status === 401 && !quiereCambiarPassword) {
        sessionStorage.removeItem('natv_token')
        navigate('/login', { replace: true })
        return
      }

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(
          datos.message || 'No fue posible guardar los cambios.'
        )
      }

      // ==================================
      // ACTUALIZAR FORMULARIO
      // ==================================

      setFormulario({
        nombre: datos.user.nombre ?? '',
        apellido: datos.user.apellido ?? '',
        telefono: datos.user.telefono ?? '',
        passwordActual: '',
        nuevaPassword: '',
        confirmarPassword: ''
      })

      // Mensaje de confirmación
      setMensaje('¡Tus datos se actualizaron correctamente!')

    } catch (error) {

      setError(
        error.message || 'No fue posible conectar con el servidor.'
      )

    } finally {

      setGuardando(false)

    }
  }

  // ==================================
  // VERIFICAR CARGA DE DATOS
  // ==================================

  if (errorCarga) {
    return (
      <main className="perfil-pagina" role="alert">
        {errorCarga}
      </main>
    )
  }

  if (cargandoDatos) {
    return (
      <main className="perfil-pagina">
        Cargando tus datos...
      </main>
    )
  }

  // ==================================
  // MOSTRAR FORMULARIO
  // ==================================

  return (
    <main className="perfil-pagina editar-pagina">

      <div className="perfil-contenedor">

        <section className="perfil-bienvenida editar-panel">

          {/* ==================================
              ENCABEZADO
          ================================== */}

          <div className="perfil-bienvenida-texto">

            <h1>
              ¡Hola, {formulario.nombre || 'Usuario'}!
            </h1>

            <p>
              Administra y actualiza la información
              personal de tu cuenta NATV.
            </p>

          </div>

          {/* ==================================
              AVATAR
          ================================== */}

          <div className="perfil-avatar-marco">

            <div className="perfil-avatar">
              <FaUser aria-label="Avatar predeterminado" />
            </div>

          </div>

          {/* ==================================
              FORMULARIO
          ================================== */}

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
                maxLength={50}
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
                maxLength={50}
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

            {/* ==================================
                CONTRASEÑA ACTUAL
            ================================== */}

            <div className="editar-campo">

              <span className="editar-campo-icono">
                <FaLock aria-hidden="true" />
              </span>

              <input
                type="password"
                name="passwordActual"
                placeholder="Contraseña actual (para cambiarla)"
                aria-label="Contraseña actual"
                autoComplete="current-password"
                value={formulario.passwordActual}
                onChange={manejarCambio}
              />

            </div>

            {/* ==================================
                NUEVA CONTRASEÑA
            ================================== */}

            <div className="editar-campo">

              <span className="editar-campo-icono">
                <FaLock aria-hidden="true" />
              </span>

              <input
                type="password"
                name="nuevaPassword"
                placeholder="Cambiar contraseña"
                aria-label="Nueva contraseña"
                autoComplete="new-password"
                minLength={8}
                value={formulario.nuevaPassword}
                onChange={manejarCambio}
              />

            </div>

            {/* ==================================
                CONFIRMAR CONTRASEÑA
            ================================== */}

            <div className="editar-campo">

              <span className="editar-campo-icono">
                <FaLock aria-hidden="true" />
              </span>

              <input
                type="password"
                name="confirmarPassword"
                placeholder="Confirmar nueva contraseña"
                aria-label="Confirmar nueva contraseña"
                autoComplete="new-password"
                value={formulario.confirmarPassword}
                onChange={manejarCambio}
              />

            </div>

            {/* ==================================
                MENSAJES
            ================================== */}

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

            {/* ==================================
                BOTÓN GUARDAR
            ================================== */}

            <div className="editar-acciones">

              <button
                type="submit"
                className="editar-guardar"
                disabled={guardando}
              >
                {guardando ? 'Guardando...' : 'Guardar datos'}
              </button>

            </div>

          </form>

        </section>

        {/* ==================================
            DECORACIÓN INFERIOR
        ================================== */}

        <div
          className="perfil-puntos"
          aria-hidden="true"
        />

      </div>

    </main>
  )
}

export default EditarDatos
