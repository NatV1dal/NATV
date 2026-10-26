
import { useNavigate } from 'react-router-dom'

import {
  FaRegHeart,
  FaImages
} from 'react-icons/fa6'

import './CardDetalleServicio.css'

// ==================================
// ICONOS DE CATEGORÍAS
// ==================================

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

// ==================================
// COMPONENTE: CARD DETALLE SERVICIO
// ==================================

function CardDetalleServicio({
  servicio,
  categoria
}) {

  const navigate = useNavigate()

  // ==================================
  // ICONO SEGÚN CATEGORÍA
  // ==================================

  const iconoCategoria = iconos[categoria.icono]

  // ==================================
  // NAVEGAR AL DETALLE DEL SERVICIO
  // ==================================

  function solicitarServicio() {

    navigate(
      `/servicios/${categoria.slug}/${servicio.slug}`
    )

  }

  // ==================================
  // FAVORITOS - DEMOSTRACIÓN
  // ==================================

  function cambiarFavorito() {

    alert(
      'Para guardar servicios en favoritos debes iniciar sesión.'
    )

  }

  // ==================================
  // TARJETA DEL SERVICIO
  // ==================================

  return (

    <article
      className="card-detalle-servicio"
      style={{
        '--color-categoria': categoria.color
      }}
    >

      {/* ==================================
          IMAGEN DEL SERVICIO
      ================================== */}

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

        {/* ==================================
            ICONO REPRESENTATIVO
        ================================== */}

        <span className="card-detalle-categoria">

          {iconoCategoria ? (

            <img
              src={iconoCategoria}
              alt=""
              aria-hidden="true"
            />

          ) : (

            <FaImages aria-hidden="true" />

          )}

        </span>

        {/* ==================================
            BOTÓN FAVORITOS
        ================================== */}

        <button
          type="button"
          className="card-detalle-favorito"
          onClick={cambiarFavorito}
          aria-label={`Guardar ${servicio.nombre} en favoritos`}
        >

          <FaRegHeart aria-hidden="true" />

        </button>

      </div>

      {/* ==================================
          INFORMACIÓN DEL SERVICIO
      ================================== */}

      <div className="card-detalle-contenido">

        {/* NOMBRE */}

        <h3>{servicio.nombre}</h3>

        {/* CATEGORÍA */}

        <span className="card-detalle-etiqueta">
          {categoria.nombre}
        </span>

        {/* DESCRIPCIÓN */}

        <p className="card-detalle-descripcion">
          {servicio.descripcion}
        </p>

        {/* ¿QUÉ INCLUYE? */}

        <div className="card-detalle-incluye">

          <strong>¿Qué incluye?</strong>

          <p>{servicio.incluye}</p>

        </div>

        {/* ==================================
            PRECIO REFERENCIAL
        ================================== */}

        <div className="card-detalle-precio">

          <span>Valor desde:</span>

          <strong>

            {servicio.precio_desde != null

              ? `$${Number(
                  servicio.precio_desde
                ).toLocaleString('es-CL')}`

              : 'A cotizar'

            }

          </strong>

        </div>

        {/* ==================================
            BOTÓN SOLICITAR SERVICIO
        ================================== */}

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
