import fotoMatrimonio from '../assets/images/servicios/fotografia-matrimonio.webp'
import fotoMascotas from '../assets/images/servicios/fotografia-mascotas.webp'

 // Trabajos de fotografía de mascotas
import mascota01 from '../assets/images/servicios/fotografia/mascotas/mascota-01.webp'
import mascota02 from '../assets/images/servicios/fotografia/mascotas/mascota-02.webp'
import mascota03 from '../assets/images/servicios/fotografia/mascotas/mascota-03.webp'
import mascota04 from '../assets/images/servicios/fotografia/mascotas/mascota-04.webp'


export const servicios = [
  {
    id: 1,
    id_categoria: 5,
    nombre: 'Sesión fotográfica personalizada',
    slug: 'sesion-fotografica-personalizada',
    descripcion: 'Lorem ipsum dolor sit amet, sgrhun . consectetur adipiscing elit.ipsum dolor sit amet, ipsum dolor sit amet.',
    incluye: 'Planificación de la sesión, toma de fotografías y selección de imágenes.',
    precio_desde: 30000,
    imagen: null,
    trabajos: []
  },
  {
    id: 2,
    id_categoria: 5,
    nombre: 'Retratos',
    slug: 'retratos',
    descripcion: 'Lorem ipsum dolor sit amet, sgrhun . consectetur adipiscing elit.ipsum dolor sit amet, ipsum dolor sit amet.',
    incluye: 'Sesión fotográfica y selección de imágenes.',
    precio_desde: 30000,
    imagen: null,
    trabajos: []
  },

{
  id: 3,
  id_categoria: 5,
  nombre: 'Fotografía de matrimonios',
  slug: 'fotografia-de-matrimonios',
  descripcion: 'Lorem ipsum dolor sit amet...',
  incluye: 'Cobertura fotográfica según los requerimientos del evento.',
  precio_desde: 350000,
  imagen: fotoMatrimonio,
  trabajos: []
},

  {
    id: 4,
    id_categoria: 5,
    nombre: 'Fotografía de eventos',
    slug: 'fotografia-de-eventos',
    descripcion: 'Lorem ipsum dolor sit amet, sgrhun . consectetur adipiscing elit.ipsum dolor sit amet, ipsum dolor sit amet.',
    incluye: 'Cobertura fotográfica del evento y selección de imágenes.',
    precio_desde: 150000,
    imagen: null,
    trabajos: []
  },
  {
    id: 5,
    id_categoria: 5,
    nombre: 'Fotografía de mascotas',
    slug: 'fotografia-de-mascotas',
    descripcion: 'Lorem ipsum dolor sit amet, sgrhun . consectetur adipiscing elit.ipsum dolor sit amet, ipsum dolor sit amet.',
    incluye: 'Cobertura fotográfica según los requerimientos del evento.',
    precio_desde: 350000,
    imagen: fotoMascotas,
    trabajos: [
    mascota01,
    mascota02,
    mascota03,
    mascota04
  ]
  },

  {
    id: 6,
    id_categoria: 5,
    nombre: 'Fotografía Aérea',
    slug: 'fotografia-aerea',
    descripcion: 'Lorem ipsum dolor sit amet, sgrhun . consectetur adipiscing elit.ipsum dolor sit amet, ipsum dolor sit amet.',
    incluye: 'Cobertura fotográfica según los requerimientos del evento.',
    precio_desde: 30000,
    imagen: null,
    trabajos: []
  },

  {
    id: 7,
    id_categoria: 5,
    nombre: 'Fotografía de productos',
    slug: 'fotografia-de-productos',
    descripcion: 'Lorem ipsum dolor sit amet, sgrhun . consectetur adipiscing elit.ipsum dolor sit amet, ipsum dolor sit amet.',
    incluye: 'Cobertura fotográfica según los requerimientos del evento.',
    precio_desde: 30000,
    imagen: null,
    trabajos: []
  }
]
