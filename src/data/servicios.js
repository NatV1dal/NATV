import fotoMatrimonio from '../assets/images/servicios/fotografia/fotografia-matrimonio.webp'
import fotoMascotas from '../assets/images/servicios/fotografia/fotografia-mascotas.webp'
import fotoEventos from '../assets/images/servicios/fotografia/fotografia-eventos.webp'
import fotoProductos from '../assets/images/servicios/fotografia/fotografia-productos.webp'
import fotoAerea from '../assets/images/servicios/fotografia/fotografia-aerea.webp'
import fotoRetratos from '../assets/images/servicios/fotografia/fotografia-retratos.webp'
import fotoSesionPerso from '../assets/images/servicios/fotografia/fotografia-sesion-personalizada.webp'
import fotoFauna from '../assets/images/servicios/fotografia/fotografia-fauna-naturaleza.webp'

 // Trabajos de fotografía de mascotas
import mascota01 from '../assets/images/servicios/fotografia/mascotas/mascota-01.webp'
import mascota02 from '../assets/images/servicios/fotografia/mascotas/mascota-02.webp'
import mascota03 from '../assets/images/servicios/fotografia/mascotas/mascota-03.webp'
import mascota04 from '../assets/images/servicios/fotografia/mascotas/mascota-04.webp'

// Trabajos sesión fotografía personalizada
import sesionPerso1 from '../assets/images/servicios/fotografia/sesiones/sesion-01.webp'
import sesionPerso2 from '../assets/images/servicios/fotografia/sesiones/sesion-02.webp'
import sesionPerso3 from '../assets/images/servicios/fotografia/sesiones/sesion-03.webp'
import sesionPerso4 from '../assets/images/servicios/fotografia/sesiones/sesion-04.webp'

// Trabajos sesión fotografía retratos
import retrato1 from '../assets/images/servicios/fotografia/retratos/retrato-01.webp'
import retrato2 from '../assets/images/servicios/fotografia/retratos/retrato-02.webp'
import retrato3 from '../assets/images/servicios/fotografia/retratos/retrato-03.webp'

// Trabajos sesión fotografía de matrimonios
import matrimonio1 from '../assets/images/servicios/fotografia/matrimonios/matrimonio-01.webp'
import matrimonio2 from '../assets/images/servicios/fotografia/matrimonios/matrimonio-02.webp'

// Trabajos sesión fotografía de fauna y naturaleza
import fauna1 from '../assets/images/servicios/fotografia/fauna-naturaleza/fauna-01.webp'
import fauna2 from '../assets/images/servicios/fotografia/fauna-naturaleza/fauna-02.webp'
import fauna3 from '../assets/images/servicios/fotografia/fauna-naturaleza/fauna-03.webp'
import fauna4 from '../assets/images/servicios/fotografia/fauna-naturaleza/fauna-04.webp'

// Trabajos sesión fotografía de productos
import producto1 from '../assets/images/servicios/fotografia/productos/producto-01.webp'
import producto2 from '../assets/images/servicios/fotografia/productos/producto-02.webp'
import producto3 from '../assets/images/servicios/fotografia/productos/producto-03.webp'

// Trabajos sesión fotografía de eventos
import evento1 from '../assets/images/servicios/fotografia/eventos/evento-01.webp'
import evento2 from '../assets/images/servicios/fotografia/eventos/evento-02.webp'
import evento3 from '../assets/images/servicios/fotografia/eventos/evento-03.webp'


// Trabajos sesión fotografía aérea
import aerea1 from '../assets/images/servicios/fotografia/aereas/aerea-01.webp'
import aerea2 from '../assets/images/servicios/fotografia/aereas/aerea-02.webp'
import aerea3 from '../assets/images/servicios/fotografia/aereas/aerea-03.webp'


export const servicios = [
  {
    id: 1,
    id_categoria: 5,
    nombre: 'Sesión fotográfica personalizada',
    slug: 'sesion-fotografica-personalizada',
    descripcion: 'Una experiencia fotográfica creada especialmente para ti. Elegimos juntos el lugar, el estilo y los detalles para capturar momentos auténticos que reflejen tu esencia.',
    incluye: 'Planificación personalizada, sesión fotográfica, selección y edición de imágenes.',
    precio_desde: 40000,
    imagen: fotoSesionPerso,
    trabajos: [
      sesionPerso1, sesionPerso2, sesionPerso3, sesionPerso4
    ]
  },
  {
    id: 2,
    id_categoria: 5,
    nombre: 'Retratos',
    slug: 'retratos',
    descripcion: 'Resaltamos tu personalidad a través de retratos profesionales, cuidando la iluminación, la composición y cada detalle. Ideales para perfiles profesionales, proyectos personales o recuerdos especiales.',
    incluye: 'Sesión de retratos, dirección fotográfica y edición de imágenes seleccionadas.',
    precio_desde: 40000,
    imagen: fotoRetratos,
    trabajos: [retrato1, retrato2, retrato3]
  },

{
  id: 3,
  id_categoria: 5,
  nombre: 'Fotografía de matrimonios',
  slug: 'fotografia-de-matrimonios',
  descripcion: 'Cada historia de amor merece ser recordada. Capturamos las emociones, los detalles y los momentos más especiales de tu matrimonio, creando recuerdos que podrás revivir una y otra vez.',
  incluye: 'Cobertura fotográfica del matrimonio, selección y edición de las mejores imágenes.',
  precio_desde: 350000,
  imagen: fotoMatrimonio,
  trabajos: [matrimonio1, matrimonio2]
},

  {
    id: 4,
    id_categoria: 5,
    nombre: 'Fotografía de eventos',
    slug: 'fotografia-de-eventos',
    descripcion: 'Capturamos los momentos que hacen único tu evento. Desde los pequeños detalles hasta sus protagonistas, creamos un registro visual profesional que refleja la esencia de cada celebración.',
    incluye: 'Cobertura fotográfica del evento, selección y edición de imágenes.',
    precio_desde: 150000,
    imagen: fotoEventos,
    trabajos: [evento1, evento2, evento3]
  },
  {
    id: 5,
    id_categoria: 5,
    nombre: 'Fotografía de mascotas',
    slug: 'fotografia-de-mascotas',
    descripcion: 'Porque ellos también son parte de nuestra historia. Capturamos la personalidad, las expresiones y los momentos más adorables de tu mascota, creando recuerdos tan especiales como el amor que les tienes.',
    incluye: 'Sesión fotográfica de mascotas, selección y edición de imágenes.',
    precio_desde: 50000,
    imagen: fotoMascotas,
    trabajos: [ mascota01, mascota02, mascota03, mascota04 ]
  },

  {
    id: 6,
    id_categoria: 5,
    nombre: 'Fotografía Aérea',
    slug: 'fotografia-aerea',
    descripcion: 'Descubre nuevas perspectivas desde las alturas. Capturamos imágenes aéreas que destacan espacios, propiedades y proyectos desde ángulos únicos, aportando una mirada diferente y profesional.',
    incluye: 'Captura de fotografías aéreas, selección y edición de imágenes en alta resolución.',
    precio_desde: 80000,
    imagen: fotoAerea,
    trabajos: [aerea1, aerea2, aerea3]
  },

    {
    id: 7,
    id_categoria: 5,
    nombre: 'Fotografía de fauna y naturaleza',
    slug: 'fotografia-de-fauna-y-naturaleza',
    descripcion: 'Exploramos la belleza del mundo natural a través de imágenes que capturan la esencia de la vida silvestre, los paisajes y sus pequeños detalles. Cada fotografía busca transmitir la conexión y diversidad de nuestro entorno.',
    incluye: 'Registro fotográfico de fauna, flora y paisajes naturales, selección y edición de imágenes.',
    precio_desde: 100000,
    imagen: fotoFauna,
    trabajos: [fauna1, fauna2, fauna3, fauna4]
  },

  {
    id: 8,
    id_categoria: 5,
    nombre: 'Fotografía de productos',
    slug: 'fotografia-de-productos',
    descripcion: 'Haz que tus productos destaquen desde la primera mirada. Creamos fotografías atractivas y profesionales que resaltan sus detalles, transmiten su esencia y potencian su presentación en tiendas online, catálogos y redes sociales.',
    incluye: 'Sesión fotográfica de productos, selección y edición de imágenes para uso comercial.',
    precio_desde: 30000,
    imagen: fotoProductos,
    trabajos: [producto1, producto2, producto3]
  }
]
