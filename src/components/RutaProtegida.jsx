
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ==================================
// COMPONENTE: RUTA PROTEGIDA
// ==================================

function RutaProtegida({ children, rolPermitido }) {

  const { usuario, cargandoSesion } = useAuth()

  // ==================================
  // VERIFICANDO LA SESIÓN
  // ==================================

  if (cargandoSesion) {
    return (
      <main className="container py-5">
        <p>Verificando sesión...</p>
      </main>
    )
  }

  // ==================================
  // USUARIO SIN SESIÓN
  // ==================================

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  // ==================================
  // VERIFICAR ROL
  // ==================================

  if (
    rolPermitido &&
    usuario.rol !== rolPermitido
  ) {

    const destino =
      usuario.rol === 'administrador'
        ? '/admin'
        : '/perfil'

    return <Navigate to={destino} replace />
  }

  // ==================================
  // ACCESO AUTORIZADO
  // ==================================

  return children
}

export default RutaProtegida
