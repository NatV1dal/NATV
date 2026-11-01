
// ==========================================
// MIDDLEWARE DE AUTORIZACIÓN POR ROLES
// ==========================================

function autorizarRol(...rolesPermitidos) {

  return (req, res, next) => {

    // Verificar que exista un usuario autenticado
    if (!req.usuario) {
      return res.status(401).json({
        message: 'Debes iniciar sesión.'
      });
    }

    // Verificar que tenga el rol permitido
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        message: 'No tienes permisos para realizar esta acción.'
      });
    }

    // Permitir continuar a la ruta
    next();

  };

}

module.exports = autorizarRol;
