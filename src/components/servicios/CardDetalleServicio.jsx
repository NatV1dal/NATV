
import { useNavigate } from 'react-router-dom'
import { FaHeart, FaRegHeart, FaImages } from 'react-icons/fa6'
import { useState } from 'react'
import './CardDetalleServicio.css'
import codigo from '../../assets/icons/codigo.svg'
import diseno from '../../assets/icons/diseno.svg'
import pluma from '../../assets/icons/pluma.svg'
import lapiz from '../../assets/icons/lapiz.svg'
import camara from '../../assets/icons/camara.svg'
import video from '../../assets/icons/video.svg'

const iconos = {
  codigo,
  diseno,
  pluma,
  lapiz,
  camara,
  video
}

function CardDetalleServicio({ servicio, categoria }) {

  const navigate = useNavigate()

  // Temporal: estado visual del corazón
  const [favorito, setFavorito] = useState(false)

  // Ir al detalle del servicio
  function solicitarServicio() {
    navigate(
      `/servicios/${categoria.slug}/${servicio.slug}`
    )
  }

  // Por ahora no guardamos favoritos reales
  function cambiarFavorito() {
    alert(
      'Para guardar servicios en favoritos debes iniciar sesión.'
    )
  }

  return (
    <article
      className="card-detalle-servicio"
      style={{ '--color-categoria': categoria.color }}
    >

      {/* Imagen del servicio */}
      <div className="card-detalle-imagen">

        {servicio.imagen ? (
          <img
            src={servicio.imagen}
            alt={servicio.nombre}
            className="card-detalle-foto"
          />
        ) : (
          <FaImages
            className="card-detalle-placeholder"
            aria-hidden="true"
          />
        )}

        {/* Ícono representativo */}
       <span className="card-detalle-categoria">
        <img
          src={iconos[categoria.icono]}
          alt=""
          aria-hidden="true"
        />
      </span>

        {/* Botón favoritos */}
        <button
          type="button"
          className="card-detalle-favorito"
          onClick={cambiarFavorito}
          aria-label={`Guardar ${servicio.nombre} en favoritos`}
        >
          {favorito ? <FaHeart /> : <FaRegHeart />}
        </button>

      </div>

      {/* Información */}
      <div className="card-detalle-contenido">

        <h3>{servicio.nombre}</h3>

        <span className="card-detalle-etiqueta">
          {categoria.nombre}
        </span>

        <p className="card-detalle-descripcion">
          {servicio.descripcion}
        </p>

        <div className="card-detalle-incluye">
          <strong>¿Qué incluye?</strong>
          <p>{servicio.incluye}</p>
        </div>

        {/* Precio */}
        <div className="card-detalle-precio">
          <span>Valor desde:</span>

          <strong>
            {servicio.precio_desde != null
              ? `$${Number(servicio.precio_desde).toLocaleString('es-CL')}`
              : 'A cotizar'}
          </strong>
        </div>

        {/* Botón de solicitud */}
        <button
          type="button"
          className="card-detalle-boton"
          onClick={solicitarServicio}
        >
          Solicitar servicio
        </button>

      </div>

    </article>
  )
}

export default CardDetalleServicio
