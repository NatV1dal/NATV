
import { Link } from 'react-router-dom'
import {
  FaLinkedin,
  FaWhatsapp,
  FaBehance,
  FaGithub,
  FaInstagram
} from 'react-icons/fa6'

import logoNatv from '../assets/images/logo-natv-blanco.svg'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer-natv">

      <div className="container">

        <div className="footer-contenido">

          {/* Logo y descripción */}
          <div className="footer-marca">

            <Link to="/#inicio" aria-label="Volver al inicio de NATV">
                <img
                src={logoNatv}
                alt="NATV"
                className="footer-logo"
                />
            </Link>
            <p>
              Diseño, desarrollo y soluciones
              digitales para proyectos con
              identidad, propósito y funcionalidad.
            </p>

          </div>

          {/* Enlaces a las secciones */}
          <nav
            className="footer-secciones"
            aria-label="Secciones del pie de página"
          >
            <h3>Secciones</h3>

            <Link to="/">Home</Link>
            <Link to="/#sobre-mi">Sobre mí</Link>
            <Link to="/#servicios">Servicios</Link>
            <a
              href="https://www.behance.net/natalievidal"
              target="_blank"
              rel="noopener noreferrer"
            >
              Portafolio
            </a>

          </nav>

          {/* Contacto y redes */}
          <div className="footer-contacto">

            <h3>Contacto</h3>

            <a href="mailto:hola@natv.cl">
              hola@natv.cl
            </a>

            <h3 className="footer-redes-titulo">
              Redes Sociales
            </h3>

            <div className="footer-redes">

              <a
                href="https://www.linkedin.com/in/natalie-vidal-aldea/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>

              <a
                href="https://wa.me/56971729407"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </a>

              <a
                href="https://www.behance.net/natalievidal"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Behance"
              >
                <FaBehance />
              </a>

              <a
                href="https://github.com/NatV1dal"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>

              <a
                href="https://www.instagram.com/natv.ph/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>

            </div>

          </div>

        </div>

      </div>

      {/* Copyright */}
      <div className="footer-copyright">
        <div className="container">
          <p>
            © 2026 NATV | Natalie Vidal A. · Todos los derechos reservados.
          </p>
        </div>
      </div>

    </footer>
  )
}

export default Footer
