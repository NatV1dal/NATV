
import { useParams, Link } from 'react-router-dom'
import { categorias } from '../data/categorias'
import BannerCategoria from '../components/servicios/BannerCategoria'

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

  return (
    <main className="container py-5">

        <BannerCategoria
        nombre={categoriaActual.nombre}
        descripcion={categoriaActual.descripcion}
        color={categoriaActual.color}
        icono={categoriaActual.icono}
        />

      <div className="py-5">
        <h2>Servicios disponibles</h2>
        <p>
          Próximamente mostraremos aquí los servicios
          correspondientes a {categoriaActual.nombre}.
        </p>
      </div>

    </main>
  )
}

export default ServiciosCategoria
