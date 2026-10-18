
import './SobreMi.css'
import fotoSobreMi from '../../assets/images/sobre-mi.png'

function SobreMi() {
  return (
    <section id="sobre-mi" className="sobre-mi-natv">
      <div className="container">

        <div className="sobre-mi-card">

          {/* Contenido */}
          <div className="sobre-mi-contenido">

            <span className="sobre-mi-etiqueta">
              SOBRE MÍ
            </span>

            <h2>Entre pluma y código</h2>

            <p>
              Mi trabajo nace de la combinación entre diseño
              gráfico y programación. Integro lo visual y lo
              funcional para transformar ideas en soluciones
              digitales claras, funcionales y con identidad propia.
            </p>

            {/* Botón LinkedIn */}
            <a
              href="https://www.linkedin.com/in/natalie-vidal-aldea/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn sobre-mi-btn"
            >
              Conoce mi trayectoria
            </a>

          </div>

          {/* Composición */}
          <div className="sobre-mi-visual">

             {/* Puntitos entre el texto e img */}
                <div className="sobre-mi-puntos-centro"></div>

            {/* Foto*/}
            <img
              src={fotoSobreMi}
              alt="Fotografía profesional de la creadora de NATV"
              className="sobre-mi-foto"
            />

            {/* Puntitos*/}
            <div className="sobre-mi-puntos"></div>

          </div>

        </div>
      </div>
    </section>
  )
}

export default SobreMi
