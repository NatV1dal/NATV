
import './BannerDetalleServicio.css'

// Íconos de las categorías
import codigo from '../../assets/icons/codigo.svg'
import diseno from '../../assets/icons/diseno.svg'
import pluma from '../../assets/icons/pluma.svg'
import lapiz from '../../assets/icons/lapiz.svg'
import camara from '../../assets/icons/camara.svg'
import video from '../../assets/icons/video.svg'

// Relacionar nombres con imágenes SVG
const iconos = {
  codigo,
  diseno,
  pluma,
  lapiz,
  camara,
  video
}

function BannerDetalleServicio({ servicio, categoria }) {
  return (
    <section className="banner-detalle-servicio">

      {/* Información del servicio */}
      <div className="banner-detalle-contenido">

        <h1>{servicio.nombre}</h1>

        <p className="banner-detalle-descripcion">
          {servicio.descripcion}
        </p>

        <div className="banner-detalle-incluye">
          <h2>¿Qué incluye?</h2>
          <p>{servicio.incluye}</p>
        </div>

      </div>

      {/* Ícono de categoría */}
      <div className="banner-detalle-icono-contenedor">
        <div
          className="banner-detalle-icono"
          style={{ backgroundColor: categoria.color }}
        >
          <img
            src={iconos[categoria.icono]}
            alt=""
            aria-hidden="true"
          />
        </div>
      </div>

    </section>
  )
}

export default BannerDetalleServicio
