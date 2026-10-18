import { Link } from 'react-router-dom'
import './Hero.css'
import heroComputador from '../../assets/images/hero-computador.png'

function Hero() {
  return (
    <section id="inicio" className="hero-natv">
      <div className="hero-shape hero-shape-left"></div>
      <div className="hero-shape hero-shape-right"></div>

      <div className="container">
        <div className="row align-items-center gy-5">

          {/* Columna izquierda */}
          <div className="col-12 col-lg-5">
            <div className="hero-content">
              <span className="hero-saludo">¡Hola!</span>

              <h1 className="hero-title">
                Demos forma a las ideas que tienes en mente.
              </h1>

              <p className="hero-text">
                Combino diseño, creatividad y tecnología para convertir
                ideas en experiencias visuales y digitales con propósito.
              </p>

              <Link to="/#servicios" className="btn hero-btn">
                Conoce mis servicios
                </Link>

              <div className="hero-dots hero-dots-bottom"></div>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="col-12 col-lg-7">
            <div className="hero-visual">
              <img
                src={heroComputador}
                alt="Ilustración de computador con interfaz de diseño web"
                className="hero-image"
              />

              <div className="hero-dots hero-dots-right"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero