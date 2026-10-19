
import { useParams, Link } from 'react-router-dom'
import { categorias } from '../data/categorias'
import BannerCategoria from '../components/servicios/BannerCategoria'
import { servicios } from '../data/servicios'
import CardDetalleServicio from '../components/servicios/CardDetalleServicio'


function ServiciosCategoria() {

  // Obtener el slug desde la URL
  const { categoria: slug } = useParams()

  // Buscar la categoría correspondiente
  const categoriaActual = categorias.find(
    (item) => item.slug === slug
  )

  // Si la categoría no existe
  if (!categoriaActual) {
    return (
      <main className="container py-5">
        <h1>Categoría no encontrada</h1>
        <p>La categoría que buscas no está disponible.</p>
        <Link to="/#servicios">
          Volver a Servicios
        </Link>
      </main>
    )
  }
    const serviciosCategoria = servicios.filter(
      (servicio) => servicio.id_categoria === categoriaActual?.id
    )

  return (
    <main className="container py-5">

        <BannerCategoria
        nombre={categoriaActual.nombre}
        descripcion={categoriaActual.descripcion}
        color={categoriaActual.color}
        icono={categoriaActual.icono}
        />

     
<section className="py-5">

  {serviciosCategoria.length > 0 ? (

    <div className="row g-4">

      {serviciosCategoria.map((servicio) => (
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


    </main>
  )
}

export default ServiciosCategoria
