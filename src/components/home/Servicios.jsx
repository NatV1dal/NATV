
import './Servicios.css'
import CardServicio from '../servicios/CardServicio'
import { categorias } from '../../data/categorias'

function Servicios() {
  return (
    <section id="servicios" className="servicios-natv">

      {/* Decoración de puntos */}
      <div className="servicios-puntos"></div>

      <div className="container">

        {/* Encabezado */}
        <div className="servicios-encabezado">
          <span className="servicios-etiqueta">
            SERVICIOS
          </span>

          <h2 className="servicios-titulo">
            Servicios Disponibles
          </h2>

          <p className="servicios-descripcion">
            Soluciones creativas y digitales para dar
            forma, identidad y presencia a tus ideas.
          </p>
        </div>

        {/* Tarjetas generadas dinámicamente */}
        <div className="row g-4">
          {categorias.map((categoria) => (
            <div
              className="col-12 col-md-6 col-lg-4"
              key={categoria.id}
            >
              <CardServicio
                nombre={categoria.nombre}
                descripcion={categoria.descripcion}
                color={categoria.color}
                icono={categoria.icono}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Servicios
