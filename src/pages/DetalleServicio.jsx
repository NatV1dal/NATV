
import { Link, useParams } from 'react-router-dom'
import { categorias } from '../data/categorias'
import { useServicios } from '../context/ServiciosContext'
import FormularioSolicitud from '../components/servicios/FormularioSolicitud'
import TrabajosServicio from '../components/servicios/TrabajosServicio'
import './DetalleServicio.css'

// Componentes
import BannerDetalleServicio from '../components/servicios/BannerDetalleServicio'

function DetalleServicio() {


  const { servicios } = useServicios()
  
  // Obtener la categoría y el servicio desde la URL
  const {
    categoria: slugCategoria,
    servicio: slugServicio
  } = useParams()

  // Buscar la categoría seleccionada
  const categoriaActual = categorias.find(
    (categoria) => categoria.slug === slugCategoria
  )

  // Buscar el servicio correspondiente
  const servicioActual = servicios.find(
    (servicio) =>
      servicio.slug === slugServicio &&
      servicio.id_categoria === categoriaActual?.id
  )

  /* ==================================
     VALIDAR SERVICIO
  ================================== */

  if (!categoriaActual || !servicioActual) {
    return (
      <main className="container py-5">

        <h1>Servicio no encontrado</h1>

        <p>
          El servicio que buscas no está disponible.
        </p>

        <Link to="/#servicios">
          Volver a Servicios
        </Link>

      </main>
    )
  }

  /* ==================================
     DETALLE DEL SERVICIO
  ================================== */

  

return (
  <main className="container py-5">

    {/* Información del servicio */}
    <BannerDetalleServicio
      servicio={servicioActual}
      categoria={categoriaActual}
    />

    {/* Formulario de solicitud */}
    <FormularioSolicitud
      servicio={servicioActual}
    />

    {/* Trabajos realizados */}
    <TrabajosServicio
      servicio={servicioActual}
    />

    {/* Puntos decorativos */}
    <div
      className="detalle-servicio-puntos"
      aria-hidden="true"
    />

  </main>
)


}

export default DetalleServicio
