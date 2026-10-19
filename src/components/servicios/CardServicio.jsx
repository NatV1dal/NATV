
import { Link } from 'react-router-dom'
import './CardServicio.css'

// Íconos
import codigo from '../../assets/icons/codigo.svg'
import diseno from '../../assets/icons/diseno.svg'
import pluma from '../../assets/icons/pluma.svg'
import lapiz from '../../assets/icons/lapiz.svg'
import camara from '../../assets/icons/camara.svg'
import video from '../../assets/icons/video.svg'

// Relacionar nombre con imagen
const iconos = {
  codigo,
  diseno,
  pluma,
  lapiz,
  camara,
  video
}

function CardServicio({ nombre, descripcion, color, icono, slug }) {
  return (
    <Link
      to={`/servicios/${slug}`}
      className="card-servicio"
      style={{ '--color-categoria': color }}
      aria-label={`Ver servicios de ${nombre}`}
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
    </Link>
  )
}

export default CardServicio
