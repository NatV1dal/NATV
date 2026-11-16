
import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

// ==================================
// CONFIGURACIÓN API
// ==================================

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000'

// ==================================
// CONTEXTO DE AUTENTICACIÓN
// ==================================

const AuthContext = createContext(null)

// ==================================
// PROVEEDOR DE AUTENTICACIÓN
// ==================================

export function AuthProvider({ children }) {

  const [usuario, setUsuario] = useState(null)
  const [cargandoSesion, setCargandoSesion] = useState(true)

  // ==================================
  // RECUPERAR SESIÓN AL CARGAR NATV
  // ==================================

  useEffect(() => {

    const token = sessionStorage.getItem('natv_token')

    if (!token) {
      setCargandoSesion(false)
      return
    }

    const controller = new AbortController()

    async function verificarSesion() {

      try {

        const respuesta = await fetch(
          `${API_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            signal: controller.signal
          }
        )

        if (respuesta.status === 401 ||
            respuesta.status === 404) {
          sessionStorage.removeItem('natv_token')
          return
        }

        if (!respuesta.ok) {
          throw new Error('No fue posible verificar la sesión.')
        }

        const datos = await respuesta.json()

        if (
          !controller.signal.aborted &&
          ['cliente', 'administrador'].includes(datos.user?.rol)
        ) {
          setUsuario(datos.user)
        }

      } catch (error) {

        if (error.name !== 'AbortError') {
          console.error('Error al verificar sesión:', error)
        }

      } finally {

        if (!controller.signal.aborted) {
          setCargandoSesion(false)
        }

      }
    }

    verificarSesion()

    return () => controller.abort()

  }, [])

  // ==================================
  // INICIAR SESIÓN
  // ==================================

  function iniciarSesion(token, datosUsuario) {
    sessionStorage.setItem('natv_token', token)
    setUsuario(datosUsuario)
  }

  // ==================================
  // CERRAR SESIÓN
  // ==================================

  function cerrarSesion() {
    sessionStorage.removeItem('natv_token')
    setUsuario(null)
  }

  // ==================================
  // ACTUALIZAR DATOS DEL USUARIO
  // ==================================

  function actualizarUsuario(datosActualizados) {

    setUsuario((anterior) => {

      if (!anterior) return anterior

      return {
        ...anterior,
        ...datosActualizados
      }

    })
  }

  // ==================================
  // COMPARTIR DATOS
  // ==================================

  return (
    <AuthContext.Provider
      value={{
        usuario,
        cargandoSesion,
        iniciarSesion,
        cerrarSesion,
        actualizarUsuario
      }}
    >

      {children}
    </AuthContext.Provider>
  )
}

// ==================================
// HOOK DE AUTENTICACIÓN
// ==================================

export function useAuth() {

  const contexto = useContext(AuthContext)

  if (!contexto) {
    throw new Error(
      'useAuth debe utilizarse dentro de AuthProvider.'
    )
  }

  return contexto
}
