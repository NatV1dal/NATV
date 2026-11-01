
const jwt = require('jsonwebtoken');

// ==========================================
// MIDDLEWARE DE AUTENTICACIÓN
// ==========================================

function verificarToken(req, res, next) {

  // Obtener token desde Authorization
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      message: 'Debes iniciar sesión para acceder.'
    });
  }

  const partes = authorization.split(' ');

  // Formato esperado: Bearer TOKEN
  if (
    partes.length !== 2 ||
    partes[0] !== 'Bearer' ||
    !partes[1]
  ) {
    return res.status(401).json({
      message: 'Formato de autorización no válido.'
    });
  }

  try {

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no configurado');
    }

    // Comprobar la firma y vigencia del token
    const usuario = jwt.verify(
      partes[1],
      process.env.JWT_SECRET,
      { algorithms: ['HS256'] }
    );

    // Guardar la información para la siguiente ruta
    req.usuario = usuario;

    // Permitir continuar
    next();

  } catch (error) {

    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError' ||
      error.name === 'NotBeforeError'
    ) {
      return res.status(401).json({
        message: 'Token inválido o expirado.'
      });
    }

    console.error('Error al validar JWT:', error.message);

    return res.status(500).json({
      message: 'Error al verificar la autenticación.'
    });
  }
}

module.exports = verificarToken;
