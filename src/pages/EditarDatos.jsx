
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

        // Comprobar el rol del usuario
        if (
          datos.user?.rol !== 'cliente' &&
          datos.user?.rol !== 'administrador'
        ) {
          throw new Error(
            'No tienes permisos para editar esta cuenta.'
          )
        }

        // Completar el formulario con datos reales
        setFormulario({
          nombre: datos.user.nombre ?? '',
          apellido: datos.user.apellido ?? '',
          telefono: datos.user.telefono ?? '',
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
  // VALIDAR EDICIÓN
  // ==================================

  function guardarDatos(evento) {

    evento.preventDefault()

    const {
      nombre,
      apellido,
      telefono,
      nuevaPassword,
      confirmarPassword
    } = formulario

    // Validar nombre y apellido
    if (!nombre.trim() || !apellido.trim()) {
      setError('Debes ingresar tu nombre y apellido.')
      return
    }

    // Validar teléfono
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

    // Limpiar los campos de contraseña después de validar
    setFormulario((anterior) => ({
      ...anterior,
      nuevaPassword: '',
      confirmarPassword: ''
    }))

    // Envío pendiente de integración con el backend
    setMensaje(
      'Formulario validado correctamente. Los cambios se guardarán cuando conectemos el backend.'
    )
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
              >
                Guardar datos
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
