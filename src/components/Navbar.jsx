
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'
import logoNatv from '../assets/images/logo-natv.svg'

function Navbar() {

  // Estado del menú hamburguesa
  const [menuAbierto, setMenuAbierto] = useState(false)

  // Estado de la sección activa
  const [seccionActiva, setSeccionActiva] = useState('home')

  // Detectar la ruta actual
  const location = useLocation()

  // Abrir y cerrar menú móvil
  function cambiarMenu() {
    setMenuAbierto(anterior => !anterior)
  }

  function cerrarMenu() {
    setMenuAbierto(false)
  }

  // Detectar la sección visible al hacer scroll
  useEffect(() => {

    // No marcar secciones del Home en otras páginas
    if (location.pathname !== '/') {
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

      // Compensar la altura del Navbar
      const posicion = window.scrollY + 160

      let activa = 'home'

      secciones.forEach((seccion) => {

        const elemento = document.getElementById(seccion.id)

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

    window.addEventListener('scroll', actualizarSeccion, {
      passive: true
    })

    window.addEventListener('resize', actualizarSeccion)

    return () => {
      window.removeEventListener('scroll', actualizarSeccion)
      window.removeEventListener('resize', actualizarSeccion)
    }

  }, [location.pathname])

  return (
    <nav className="navbar navbar-expand-lg navbar-natv">
      <div className="container">

        {/* Logotipo */}
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
        
        {/* Botón menú móvil */}
        <button
          className="navbar-toggler"
          type="button"
          aria-label="Abrir o cerrar menú"
          aria-expanded={menuAbierto}
          aria-controls="menuNatv"
          onClick={cambiarMenu}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navegación */}
        <div
          id="menuNatv"
          className={`collapse navbar-collapse ${
            menuAbierto ? 'show' : ''
          }`}
        >
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">

            {/* Home */}
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link ${
                  seccionActiva === 'home' ? 'activo' : ''
                }`}
                onClick={cerrarMenu}
              >
                Home
              </Link>
            </li>

            {/* Sobre mí */}
            <li className="nav-item">
              <Link
                to="/#sobre-mi"
                className={`nav-link ${
                  seccionActiva === 'sobre-mi' ? 'activo' : ''
                }`}
                onClick={cerrarMenu}
              >
                Sobre mí
              </Link>
            </li>

            {/* Servicios */}
            <li className="nav-item">
              <Link
                to="/#servicios"
                className={`nav-link ${
                  seccionActiva === 'servicios' ? 'activo' : ''
                }`}
                onClick={cerrarMenu}
              >
                Servicios
              </Link>
            </li>

            {/* Contacto */}
            <li className="nav-item">
              <Link
                to="/#contacto"
                className={`nav-link ${
                  seccionActiva === 'contacto' ? 'activo' : ''
                }`}
                onClick={cerrarMenu}
              >
                Contacto
              </Link>
            </li>

          </ul>

          {/* Botones */}
          <div className="navbar-actions d-flex gap-2">

            <a
              className="btn btn-portafolio"
              href="https://www.behance.net/natalievidal"
              target="_blank"
              rel="noopener noreferrer"
              onClick={cerrarMenu}
            >
              Portafolio
            </a>

            <Link
              className="btn btn-login"
              to="/login"
              onClick={cerrarMenu}
            >
              Login
            </Link>

          </div>

        </div>
      </div>
    </nav>
  )
}

export default Navbar
