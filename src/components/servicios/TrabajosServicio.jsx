
import { useEffect, useState } from 'react'
import {
  FaArrowLeft,
  FaArrowRight,
  FaXmark
} from 'react-icons/fa6'

import './TrabajosServicio.css'

function TrabajosServicio({ servicio }) {

  const [inicio, setInicio] = useState(0)
  const [cantidadVisible, setCantidadVisible] = useState(3)
  const [imagenAmpliada, setImagenAmpliada] = useState(null)

  // Obtener las fotografías del servicio
  const trabajos = Array.isArray(servicio.trabajos)
    ? servicio.trabajos.filter(Boolean)
    : []

  // Mostrar únicamente fotografías de trabajos realizados
const imagenes = trabajos

  // Adaptar la cantidad de imágenes a cada pantalla
  useEffect(() => {

    function actualizarCantidad() {
      if (window.innerWidth < 576) {
        setCantidadVisible(1)
      } else if (window.innerWidth < 992) {
        setCantidadVisible(2)
      } else {
        setCantidadVisible(3)
      }
    }

    actualizarCantidad()

    window.addEventListener('resize', actualizarCantidad)

    return () => {
      window.removeEventListener('resize', actualizarCantidad)
    }

  }, [])

  // Reiniciar la galería al cambiar de servicio
  useEffect(() => {
    setInicio(0)
    setImagenAmpliada(null)
  }, [servicio.id])

  // Calcular las posiciones disponibles
  const maxInicio = Math.max(
    0,
    imagenes.length - cantidadVisible
  )

  const inicioVisible = Math.min(inicio, maxInicio)

  // Fotografías que aparecen en el carrusel
  const imagenesVisibles = imagenes.slice(
    inicioVisible,
    inicioVisible + cantidadVisible
  )

  const tieneNavegacion = maxInicio > 0

  // Carrusel: avanzar de una imagen
  function siguiente() {
    setInicio((actual) => {
      const posicion = Math.min(actual, maxInicio)
      return posicion >= maxInicio ? 0 : posicion + 1
    })
  }

  // Carrusel: retroceder una imagen
  function anterior() {
    setInicio((actual) => {
      const posicion = Math.min(actual, maxInicio)
      return posicion <= 0 ? maxInicio : posicion - 1
    })
  }

  // Abrir imagen ampliada
  function abrirImagen(indice) {
    setImagenAmpliada(indice)
  }

  // Cerrar imagen ampliada
  function cerrarImagen() {
    setImagenAmpliada(null)
  }

  // Avanzar dentro de la imagen ampliada
  function siguienteAmpliada() {
    setImagenAmpliada((actual) =>
      (actual + 1) % imagenes.length
    )
  }

  // Retroceder dentro de la imagen ampliada
  function anteriorAmpliada() {
    setImagenAmpliada((actual) =>
      (actual - 1 + imagenes.length) % imagenes.length
    )
  }

  // Controles de teclado y bloqueo del scroll
  useEffect(() => {

    if (imagenAmpliada === null) return

    const scrollAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function manejarTeclado(evento) {
      if (evento.key === 'Escape') {
        cerrarImagen()
      }

      if (imagenes.length > 1) {
        if (evento.key === 'ArrowRight') {
          siguienteAmpliada()
        }

        if (evento.key === 'ArrowLeft') {
          anteriorAmpliada()
        }
      }
    }

    window.addEventListener('keydown', manejarTeclado)

    return () => {
      document.body.style.overflow = scrollAnterior
      window.removeEventListener('keydown', manejarTeclado)
    }

  }, [imagenAmpliada, imagenes.length])

  // No mostrar la galería sin fotografías
  if (imagenes.length === 0) {
    return null
  }

  return (
    <>
      <section className="trabajos-servicio">

        <h2>Trabajos realizados</h2>

        {/* Carrusel */}
        <div className="trabajos-servicio-carrusel">

          {/* Flecha izquierda */}
          {tieneNavegacion && (
            <button
              type="button"
              className="trabajos-servicio-flecha"
              onClick={anterior}
              aria-label="Ver trabajos anteriores"
            >
              <FaArrowLeft />
            </button>
          )}

          {/* Fotografías */}
          <div className="trabajos-servicio-galeria">

            {imagenesVisibles.map((imagen, indice) => {

              const indiceReal = inicioVisible + indice

              return (
                <button
                  type="button"
                  className="trabajos-servicio-tarjeta"
                  key={`${servicio.id}-${indiceReal}`}
                  onClick={() => abrirImagen(indiceReal)}
                  aria-label={`Ampliar fotografía ${indiceReal + 1}`}
                >
                  <img
                    src={imagen}
                    alt={`Trabajo ${indiceReal + 1} de ${servicio.nombre}`}
                    loading="lazy"
                  />
                </button>
              )
            })}

          </div>

          {/* Flecha derecha */}
          {tieneNavegacion && (
            <button
              type="button"
              className="trabajos-servicio-flecha"
              onClick={siguiente}
              aria-label="Ver trabajos siguientes"
            >
              <FaArrowRight />
            </button>
          )}

        </div>

        {/* Indicadores de posición */}
        {tieneNavegacion && (
          <div className="trabajos-servicio-indicadores">

            {Array.from(
              { length: maxInicio + 1 },
              (_, indice) => (
                <button
                  key={indice}
                  type="button"
                  className={
                    inicioVisible === indice
                      ? 'trabajos-servicio-punto activo'
                      : 'trabajos-servicio-punto'
                  }
                  onClick={() => setInicio(indice)}
                  aria-label={`Ver posición ${indice + 1}`}
                  aria-current={
                    inicioVisible === indice
                      ? 'true'
                      : undefined
                  }
                />
              )
            )}

          </div>
        )}

      </section>

      {/* Visor de imagen ampliada */}
      {imagenAmpliada !== null && (
        <div
          className="trabajos-servicio-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Fotografía ampliada"
          onClick={(evento) => {
            if (evento.target === evento.currentTarget) {
              cerrarImagen()
            }
          }}
        >

          <button
            type="button"
            className="trabajos-modal-cerrar"
            onClick={cerrarImagen}
            aria-label="Cerrar fotografía"
          >
            <FaXmark />
          </button>

          {imagenes.length > 1 && (
            <button
              type="button"
              className="trabajos-modal-flecha"
              onClick={anteriorAmpliada}
              aria-label="Fotografía anterior"
            >
              <FaArrowLeft />
            </button>
          )}

          <div className="trabajos-modal-contenido">

            <img
              src={imagenes[imagenAmpliada]}
              alt={`Fotografía ampliada ${imagenAmpliada + 1} de ${servicio.nombre}`}
            />

            <span className="trabajos-modal-contador">
              {imagenAmpliada + 1} / {imagenes.length}
            </span>

          </div>

          {imagenes.length > 1 && (
            <button
              type="button"
              className="trabajos-modal-flecha"
              onClick={siguienteAmpliada}
              aria-label="Fotografía siguiente"
            >
              <FaArrowRight />
            </button>
          )}

        </div>
      )}

    </>
  )
}


export default TrabajosServicio
