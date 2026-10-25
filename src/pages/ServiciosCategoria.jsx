
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

// Datos
import { categorias } from '../data/categorias'
import { servicios } from '../data/servicios'

// Componentes
import BannerCategoria from '../components/servicios/BannerCategoria'
import CardDetalleServicio from '../components/servicios/CardDetalleServicio'

// Estilos
import './ServiciosCategoria.css'

function ServiciosCategoria() {

  // Obtener la categoría desde la URL
  const { categoria: slug } = useParams()

  // Estado de la página seleccionada
  const [paginaActual, setPaginaActual] = useState(1)

  // Buscar la categoría actual
  const categoriaActual = categorias.find(
    (categoria) => categoria.slug === slug
  )

  // Filtrar los servicios de la categoría
  const serviciosCategoria = servicios.filter(
    (servicio) => servicio.id_categoria === categoriaActual?.id
  )

  /* ==================================
     PAGINACIÓN
  ================================== */

  // Cantidad máxima de servicios por página
  const serviciosPorPagina = 6

  // Calcular el total de páginas
  const totalPaginas = Math.ceil(
    serviciosCategoria.length / serviciosPorPagina
  )

  // Evitar que la página seleccionada supere el total
  const paginaVisible = Math.min(
    Math.max(paginaActual, 1),
    Math.max(totalPaginas, 1)
  )

  // Calcular la posición inicial
  const indiceInicial = (paginaVisible - 1) * serviciosPorPagina

  // Mostrar solamente los servicios correspondientes
  const serviciosVisibles = serviciosCategoria.slice(
    indiceInicial,
    indiceInicial + serviciosPorPagina
  )

  // Reiniciar la paginación al cambiar de categoría
  useEffect(() => {
    setPaginaActual(1)
  }, [slug])

  // Función para cambiar de página
  function cambiarPagina(nuevaPagina) {

    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) {
      return
    }

    setPaginaActual(nuevaPagina)

    // Volver al inicio de la lista de servicios
    const seccionServicios = document.getElementById(
      'lista-servicios'
    )

    if (seccionServicios) {
      seccionServicios.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  /* ==================================
     VALIDAR CATEGORÍA
  ================================== */

  if (!categoriaActual) {
    return (
      <main className="container py-5">

        <h1>Categoría no encontrada</h1>

        <p>
          La categoría que buscas no está disponible.
        </p>

        <Link to="/#servicios">
          Volver a Servicios
        </Link>

      </main>
    )
  }

  /* ==================================
     VISTA SERVICIOS POR CATEGORÍA
  ================================== */

  return (
    <main className="container py-5">

      {/* Banner de categoría */}
      <BannerCategoria
        nombre={categoriaActual.nombre}
        descripcion={categoriaActual.descripcion}
        color={categoriaActual.color}
        icono={categoriaActual.icono}
      />

      {/* Listado de servicios */}
      <section
        id="lista-servicios"
        className="py-5"
        style={{ scrollMarginTop: '100px' }}
      >

        {serviciosCategoria.length > 0 ? (

          <div className="row g-4">

            {serviciosVisibles.map((servicio) => (

              <div
                key={servicio.id}
                className="col-12 col-md-6 col-lg-4"
              >

                <CardDetalleServicio
                  servicio={servicio}
                  categoria={categoriaActual}
                />

              </div>

            ))}

          </div>

        ) : (

          <p>
            Actualmente no hay servicios publicados
            en esta categoría.
          </p>

        )}

      </section>

      {/* ==================================
          PAGINACIÓN
      ================================== */}

      {totalPaginas > 0 && (

        <nav
          className="servicios-paginacion"
          aria-label="Paginación de servicios"
        >

          {/* Flecha anterior */}
          <button
            type="button"
            onClick={() => cambiarPagina(paginaVisible - 1)}
            disabled={paginaVisible === 1}
            aria-label="Página anterior"
          >
            ‹
          </button>

          {/* Números de páginas */}
          {Array.from(
            { length: totalPaginas },
            (_, indice) => indice + 1
          ).map((numero) => (

            <button
              key={numero}
              type="button"
              className={`servicios-pagina-numero ${
                paginaVisible === numero ? 'activa' : ''
              }`}
              onClick={() => cambiarPagina(numero)}
              aria-label={`Ir a la página ${numero}`}
              aria-current={
                paginaVisible === numero ? 'page' : undefined
              }
            >
              {numero}
            </button>

          ))}

          {/* Flecha siguiente */}
          <button
            type="button"
            onClick={() => cambiarPagina(paginaVisible + 1)}
            disabled={paginaVisible === totalPaginas}
            aria-label="Página siguiente"
          >
            ›
          </button>

        </nav>

      )}

      {/* Puntos decorativos */}
      <div
        className="servicios-categoria-puntos"
        aria-hidden="true"
      ></div>

    </main>
  )
}

export default ServiciosCategoria
