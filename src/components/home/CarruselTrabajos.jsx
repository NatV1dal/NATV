
import { useState, useEffect } from 'react'
import './CarruselTrabajos.css'

// Imágenes de escritorio
import proyecto1 from '../../assets/images/trabajos/proyecto-1.webp'
import proyecto2 from '../../assets/images/trabajos/proyecto-2.webp'
import proyecto3 from '../../assets/images/trabajos/proyecto-3.webp'
import proyecto4 from '../../assets/images/trabajos/proyecto-4.webp'
import proyecto5 from '../../assets/images/trabajos/proyecto-5.webp'
import proyecto6 from '../../assets/images/trabajos/proyecto-6.webp'

// Imágenes móviles
import proyectoMovil1 from '../../assets/images/trabajos/proyectoMovil-1.webp'
import proyectoMovil2 from '../../assets/images/trabajos/proyectoMovil-2.webp'
import proyectoMovil3 from '../../assets/images/trabajos/proyectoMovil-3.webp'
import proyectoMovil4 from '../../assets/images/trabajos/proyectoMovil-4.webp'
import proyectoMovil5 from '../../assets/images/trabajos/proyectoMovil-5.webp'
import proyectoMovil6 from '../../assets/images/trabajos/proyectoMovil-6.webp'

// Datos de los proyectos
const trabajos = [
  {
    id: 1,
    imagen: proyecto1,
    imagenMovil: proyectoMovil1,
    nombre: 'Proyecto 1'
  },
  {
    id: 2,
    imagen: proyecto2,
    imagenMovil: proyectoMovil2,
    nombre: 'Proyecto 2'
  },
  {
    id: 3,
    imagen: proyecto3,
    imagenMovil: proyectoMovil3,
    nombre: 'Proyecto 3'
  },
  {
    id: 4,
    imagen: proyecto4,
    imagenMovil: proyectoMovil4,
    nombre: 'Proyecto 4'
  },
  {
    id: 5,
    imagen: proyecto5,
    imagenMovil: proyectoMovil5,
    nombre: 'Proyecto 5'
  },
  {
    id: 6,
    imagen: proyecto6,
    imagenMovil: proyectoMovil6,
    nombre: 'Proyecto 6'
  }
]

function CarruselTrabajos() {

  // Proyecto que se muestra actualmente
  const [imagenActual, setImagenActual] = useState(0)

  // Cambio automático cada 5 segundos
  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagenActual((actual) =>
        (actual + 1) % trabajos.length
      )
    }, 5000)

    // Limpieza del intervalo
    return () => clearInterval(intervalo)
  }, [])

  // Siguiente proyecto
  const siguiente = () => {
    setImagenActual((actual) =>
      (actual + 1) % trabajos.length
    )
  }

  // Proyecto anterior
  const anterior = () => {
    setImagenActual((actual) =>
      (actual - 1 + trabajos.length) % trabajos.length
    )
  }

  // Seleccionar proyecto mediante indicadores
  const seleccionarProyecto = (indice) => {
    setImagenActual(indice)
  }

  return (
    <div className="carrusel-trabajos">

      {/* Carrusel */}
      <div className="carrusel-contenido">

        {/* Flecha anterior */}
        <button
          type="button"
          className="carrusel-flecha"
          onClick={anterior}
          aria-label="Ver proyecto anterior"
        >
          &#10094;
        </button>

        {/* Imágenes responsive */}
        <picture
          key={trabajos[imagenActual].id}
          className="carrusel-picture"
        >
          {/* Versión móvil */}
          <source
            media="(max-width: 575.98px)"
            srcSet={trabajos[imagenActual].imagenMovil}
          />

          {/* Versión escritorio */}
          <img
            src={trabajos[imagenActual].imagen}
            alt={trabajos[imagenActual].nombre}
            className="carrusel-imagen"
          />
        </picture>

        {/* Flecha siguiente */}
        <button
          type="button"
          className="carrusel-flecha"
          onClick={siguiente}
          aria-label="Ver proyecto siguiente"
        >
          &#10095;
        </button>

      </div>

      {/* Indicadores de los seis proyectos */}
      <div className="carrusel-indicadores">

        {trabajos.map((trabajo, indice) => (
          <button
            key={trabajo.id}
            type="button"
            className={
              indice === imagenActual
                ? 'carrusel-punto activo'
                : 'carrusel-punto'
            }
            onClick={() => seleccionarProyecto(indice)}
            aria-label={`Ver proyecto ${indice + 1}`}
            aria-current={
              indice === imagenActual ? 'true' : undefined
            }
          />
        ))}

      </div>

      {/* Enlace a Behance */}
      <a
        href="https://www.behance.net/natalievidal"
        target="_blank"
        rel="noopener noreferrer"
        className="btn carrusel-boton"
      >
        Conoce más de mi trabajo
      </a>

    </div>
  )
}

export default CarruselTrabajos
