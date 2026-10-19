
import './BannerCategoria.css'

// Íconos de las categorías
import codigo from '../../assets/icons/codigo.svg'
import diseno from '../../assets/icons/diseno.svg'
import pluma from '../../assets/icons/pluma.svg'
import lapiz from '../../assets/icons/lapiz.svg'
import camara from '../../assets/icons/camara.svg'
import video from '../../assets/icons/video.svg'

// Relacionar los nombres con sus imágenes
const iconos = {
  codigo,
  diseno,
  pluma,
  lapiz,
  camara,
  video
}

function BannerCategoria({ nombre, descripcion, color, icono }) {
  return (
    <section className="banner-categoria">

      {/* Información de la categoría */}
      <div className="banner-categoria-contenido">
       
        <h1>
            <span>SERVICIOS</span>
            <span>DE {nombre.toUpperCase()}</span>
        </h1>


        <p>{descripcion}</p>
      </div>

      {/* Ícono de la categoría */}
      <div className="banner-categoria-icono-contenedor">
        <div
          className="banner-categoria-icono"
          style={{ backgroundColor: color }}
        >
          <img
            src={iconos[icono]}
            alt=""
            aria-hidden="true"
          />
        </div>
      </div>

    </section>
  )
}

export default BannerCategoria
