
import { useState } from 'react'
import './Navbar.css'
import logoNatv from '../assets/images/logo-natv.svg'

function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  function cambiarMenu() {
    setMenuAbierto(!menuAbierto)
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-natv">
      <div className="container">

        {/* Logotipo */}
        <a className="navbar-brand" href="/">
          <img
            src={logoNatv}
            alt="NATV - Ideas que funcionan"
            className="logo-natv"
          />
        </a>

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
            <li className="nav-item">
              <a className="nav-link" href="/">Inicio</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/#sobre-mi">Sobre mí</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/#servicios">Servicios</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/#contacto">Contacto</a>
            </li>
          </ul>

          <div className="navbar-actions d-flex gap-2">
            <a className="btn btn-portafolio" href="#portafolio">
              Portafolio
            </a>

            <a className="btn btn-login" href="/login">
              Login
            </a>
          </div>
        </div>

      </div>
    </nav>
  )
}

export default Navbar
