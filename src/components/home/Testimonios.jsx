
import './Testimonios.css'
import CardTestimonio from '../testimonios/CardTestimonio'
import { testimonios } from '../../data/testimonios'

function Testimonios() {
  return (
    <section
      id="testimonios"
      className="testimonios-natv"
    >
     <div className="testimonios-puntos izquierda"></div>   
     <div className="testimonios-puntos derecha"></div>

      <div className="container">

        <div className="testimonios-encabezado">
          <span className="testimonios-etiqueta">
            TESTIMONIOS
          </span>

          <h2>¿Qué dicen mis clientes?</h2>

          <p>
            Experiencias de personas con las que he
            tenido la oportunidad de trabajar.
          </p>
        </div>

        <div className="testimonios-grid">
          {testimonios.map((testimonio) => (
            <CardTestimonio
              key={testimonio.id}
              comentario={testimonio.comentario}
              nombre={testimonio.nombre}
              proyecto={testimonio.proyecto}
              foto={testimonio.foto}
              color={testimonio.color}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

export default Testimonios
