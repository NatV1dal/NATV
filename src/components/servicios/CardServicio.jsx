
import './CardServicio.css'


//íconos //
import codigo from '../../assets/icons/codigo.svg'
import diseno from '../../assets/icons/diseno.svg'
import pluma from '../../assets/icons/pluma.svg'
import lapiz from '../../assets/icons/lapiz.svg'
import camara from '../../assets/icons/camara.svg'
import video from '../../assets/icons/video.svg'

// Relacion nombre a imagen
const iconos = {
  codigo,
  diseno,
  pluma,
  lapiz,
  camara,
  video
}

function CardServicio({ nombre, descripcion, color, icono }) {
  return (
    <article
      className="card-servicio"
      style={{ '--color-categoria': color }}
    >
      <div className="card-servicio-icono">
        <img
          src={iconos[icono]}
          alt=""
          aria-hidden="true"
        />
      </div>

      <h3>{nombre}</h3>

      <p>{descripcion}</p>

      <span className="card-servicio-enlace">
        Más info
      </span>
    </article>
  )
}

export default CardServicio
