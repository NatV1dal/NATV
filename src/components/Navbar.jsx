
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import './Navbar.css'
import logoNatv from '../assets/images/logo-natv.svg'

// ==================================
// COMPONENTE NAVBAR NATV
// ==================================

function Navbar() {

  // ==================================
  // ESTADOS
  // ==================================

  const [menuAbierto, setMenuAbierto] = useState(false)

  const [seccionActiva, setSeccionActiva] = useState('home')

  // ==================================
  // RUTA ACTUAL
  // ==================================

  const location = useLocation()

  const rutaActual = location.pathname
  const hashActual = location.hash

  // ==================================
  // TIPO DE NAVEGACIÓN
  // ==================================

  // Detección temporal para el Hito 2.
  // Más adelante utilizaremos AuthContext
  // y el rol del usuario autenticado.

  const esAdministrador =
    rutaActual.startsWith('/admin') ||
    (
      rutaActual === '/perfil/editar' &&
      location.state?.desdeAdmin === true
    )

  const esCliente =
    !esAdministrador &&
    (
      rutaActual === '/perfil' ||
      rutaActual.startsWith('/perfil/')
    )

  // ==================================
  // MENÚ HAMBURGUESA
  // ==================================

  function cambiarMenu() {
    setMenuAbierto((anterior) => !anterior)
  }

  function cerrarMenu() {
    setMenuAbierto(false)
  }

  // Cerrar el menú móvil al cambiar de ruta
  useEffect(() => {
    setMenuAbierto(false)
  }, [rutaActual, hashActual])

  // ==================================
  // DETECTAR SECCIÓN ACTIVA DEL HOME
  // ==================================

  useEffect(() => {

    if (rutaActual !== '/') {
      setSeccionActiva('')
      return
    }

    function actualizarSeccion() {

      const secciones = [
        { id: 'sobre-mi', nombre: 'sobre-mi' },
        { id: 'servicios', nombre: 'servicios' },
        { id: 'testimonios', nombre: 'servicios' },
        { id: 'contacto', nombre: 'contacto' }
      ]

      const posicion = window.scrollY + 160

      let activa = 'home'

      secciones.forEach((seccion) => {

        const elemento = document.getElementById(
          seccion.id
        )

        if (elemento) {

          const inicioSeccion =
            elemento.getBoundingClientRect().top +
            window.scrollY

          if (inicioSeccion <= posicion) {
            activa = seccion.nombre
          }

        }

      })

      setSeccionActiva(activa)

    }

    actualizarSeccion()

    window.addEventListener(
      'scroll',
      actualizarSeccion,
      { passive: true }
    )

    window.addEventListener(
      'resize',
      actualizarSeccion
    )

    return () => {

      window.removeEventListener(
        'scroll',
        actualizarSeccion
      )

      window.removeEventListener(
        'resize',
        actualizarSeccion
      )

    }

  }, [rutaActual])

  // ==================================
  // CLASE DEL ENLACE ACTIVO
  // ==================================

  function claseEnlace(activo) {
    return `nav-link ${activo ? 'activo' : ''}`
  }

  // ==================================
  // NAVBAR
  // ==================================

  return (

    <nav className="navbar navbar-expand-lg navbar-natv">

      <div className="container">

        {/* ==================================
            LOGOTIPO NATV
        ================================== */}

        <Link
          className="navbar-brand"
          to="/#inicio"
          onClick={cerrarMenu}
        >

          <img
            src={logoNatv}
            alt="NATV - Ideas que funcionan"
            className="logo-natv"
          />

        </Link>

        {/* ==================================
            BOTÓN HAMBURGUESA
        ================================== */}

        <button
          className="navbar-toggler"
          type="button"
          aria-label="Abrir o cerrar menú"
          aria-expanded={menuAbierto}
          aria-controls="menuNatv"
          onClick={cambiarMenu}
        >

          <span className="navbar-toggler-icon" />

        </button>

        {/* ==================================
            CONTENEDOR DE NAVEGACIÓN
        ================================== */}

        <div
          id="menuNatv"
          className={`collapse navbar-collapse ${
            menuAbierto ? 'show' : ''
          }`}
        >

          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">

            {/* ==================================
                NAVBAR ADMINISTRADOR
            ================================== */}

            {esAdministrador ? (

              <>

                {/* PERFIL */}

                <li className="nav-item">

                  <Link
                    to="/admin"
                    className={claseEnlace(
                      rutaActual === '/admin' ||
                      rutaActual === '/admin/procesos' ||
                      rutaActual === '/admin/finalizados' ||
                      (
                        rutaActual === '/perfil/editar' &&
                        location.state?.desdeAdmin === true
                      )
                    )}
                    onClick={cerrarMenu}
                  >
                    Perfil
                  </Link>

                </li>

                {/* SOLICITUDES */}

                <li className="nav-item">

                  <Link
                    to="/admin/solicitudes"
                    className={claseEnlace(
                      rutaActual === '/admin/solicitudes'
                    )}
                    onClick={cerrarMenu}
                  >
                    Solicitudes
                  </Link>

                </li>

                {/* COTIZACIONES */}

                <li className="nav-item">

                  <Link
                    to="/admin/cotizaciones"
                    className={claseEnlace(
                      rutaActual.startsWith(
                        '/admin/cotizaciones'
                      )
                    )}
                    onClick={cerrarMenu}
                  >
                    Cotizaciones
                  </Link>

                </li>

                {/* AGREGAR SERVICIO */}

                <li className="nav-item">

                  <Link
                    to="/admin/agregar-servicio"
                    className={claseEnlace(
                      rutaActual ===
                        '/admin/agregar-servicio'
                    )}
                    onClick={cerrarMenu}
                  >
                    Agregar Servicio
                  </Link>

                </li>

              </>

            ) : esCliente ? (

              <>

                {/* ==================================
                    NAVBAR CLIENTE
                ================================== */}

                {/* PERFIL */}

                <li className="nav-item">

                  <Link
                    to="/perfil"
                    className={claseEnlace(
                      rutaActual === '/perfil' &&
                      hashActual !== '#solicitudes' &&
                      hashActual !== '#favoritos'
                    )}
                    onClick={cerrarMenu}
                  >
                    Perfil
                  </Link>

                </li>

                {/* SOLICITUDES */}

                <li className="nav-item">

                  <Link
                    to="/perfil#solicitudes"
                    className={claseEnlace(
                      rutaActual.startsWith(
                        '/perfil/solicitudes'
                      ) ||
                      (
                        rutaActual === '/perfil' &&
                        hashActual === '#solicitudes'
                      )
                    )}
                    onClick={cerrarMenu}
                  >
                    Solicitudes
                  </Link>

                </li>

                {/* FAVORITOS */}

                <li className="nav-item">

                  <Link
                    to="/perfil#favoritos"
                    className={claseEnlace(
                      rutaActual === '/perfil' &&
                      hashActual === '#favoritos'
                    )}
                    onClick={cerrarMenu}
                  >
                    Favoritos
                  </Link>

                </li>

                {/* SERVICIOS */}

                <li className="nav-item">

                  <Link
                    to="/#servicios"
                    className={claseEnlace(false)}
                    onClick={cerrarMenu}
                  >
                    Servicios
                  </Link>

                </li>

              </>

            ) : (

              <>

                {/* ==================================
                    NAVBAR PÚBLICO
                ================================== */}

                {/* HOME */}

                <li className="nav-item">

                  <Link
                    to="/"
                    className={claseEnlace(
                      seccionActiva === 'home'
                    )}
                    onClick={cerrarMenu}
                  >
                    Home
                  </Link>

                </li>

                {/* SOBRE MÍ */}

                <li className="nav-item">

                  <Link
                    to="/#sobre-mi"
                    className={claseEnlace(
                      seccionActiva === 'sobre-mi'
                    )}
                    onClick={cerrarMenu}
                  >
                    Sobre mí
                  </Link>

                </li>

                {/* SERVICIOS */}

                <li className="nav-item">

                  <Link
                    to="/#servicios"
                    className={claseEnlace(
                      seccionActiva === 'servicios'
                    )}
                    onClick={cerrarMenu}
                  >
                    Servicios
                  </Link>

                </li>

                {/* CONTACTO */}

                <li className="nav-item">

                  <Link
                    to="/#contacto"
                    className={claseEnlace(
                      seccionActiva === 'contacto'
                    )}
                    onClick={cerrarMenu}
                  >
                    Contacto
                  </Link>

                </li>

              </>

            )}

          </ul>

          {/* ==================================
              BOTONES DERECHA
          ================================== */}

          <div className="navbar-actions d-flex gap-2">

            {esAdministrador || esCliente ? (

              /* ==================================
                  CERRAR SESIÓN - DEMOSTRACIÓN
              ================================== */

              <Link
                className="btn btn-login"
                to="/login"
                onClick={cerrarMenu}
              >
                Cerrar sesión
              </Link>

            ) : (

              <>

                {/* PORTAFOLIO */}

                <a
                  className="btn btn-portafolio"
                  href="https://www.behance.net/natalievidal"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={cerrarMenu}
                >
                  Portafolio
                </a>

                {/* LOGIN */}

                <Link
                  className="btn btn-login"
                  to="/login"
                  onClick={cerrarMenu}
                >
                  Login
                </Link>

              </>

            )}

          </div>

        </div>

      </div>

    </nav>

  )
}

export default Navbar
