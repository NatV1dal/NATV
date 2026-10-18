
import './Navbar.css'
import logoNatv from '../assets/images/logo-natv.svg'

function Navbar() {
  return (
    <nav className="navbar">
        <div className="navbar-logo">
        <img src={logoNatv} alt="NATV - Ideas que funcionan" />
        </div>


      <ul className="navbar-menu">
        <li>Inicio</li>
        <li>Sobre mí</li>
        <li>Servicios</li>
        <li>Contacto</li>
      </ul>

      <div className="navbar-actions">
        <button className="btn-portafolio">
          Portafolio
        </button>

        <button className="btn-login">
          Login
        </button>
      </div>
    </nav>
  )
}

export default Navbar
