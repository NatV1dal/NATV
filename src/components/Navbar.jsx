
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'
import logoNatv from '../assets/images/logo-natv.svg'

function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  function cambiarMenu() {
     setMenuAbierto(anterior => !anterior)
  }

  function cerrarMenu() {
    setMenuAbierto(false)
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-natv">
      <div className="container">

        {/* Logotipo */}
        <Link className="navbar-brand" to="/">
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

            {/* Inicio con NavLink */}
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'activo' : ''}`
                }
                onClick={cerrarMenu}
              >
                Inicio
              </NavLink>
            </li>

            {/* Sobre mí */}
            <li className="nav-item">
              <a
                className="nav-link"
                href="/#sobre-mi"
                onClick={cerrarMenu}
              >
                Sobre mí
              </a>
            </li>

            {/* Servicios */}
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="/#servicios"
                  onClick={cerrarMenu}
                >
                  Servicios
                </a>
              </li>

            {/* Contacto */}
            <li className="nav-item">
              <a
                className="nav-link"
                href="/#contacto"
                onClick={cerrarMenu}
              >
                Contacto
              </a>
            </li>

          </ul>

          {/* Botones */}
          <div className="navbar-actions d-flex gap-2">
            <a
              className="btn btn-portafolio"
              href="/#portafolio"
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
