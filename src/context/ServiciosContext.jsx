
import {
  createContext,
  useContext,
  useMemo,
  useState
} from 'react'

import { servicios as serviciosBase } from '../data/servicios'
import { categorias } from '../data/categorias'

// ==================================
// CONTEXT DE SERVICIOS NATV
// ==================================

const ServiciosContext = createContext(null)

// Almacenamiento nuevo y anterior
const CLAVE_STORAGE = 'natv_catalogo_admin_v2'
const CLAVE_ANTERIOR = 'natv_servicios_admin'

// ==================================
// CREAR SLUG
// ==================================

function crearSlug(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ==================================
// NORMALIZAR SERVICIOS ANTIGUOS
// ==================================

function normalizarServicio(servicio) {

  if (!servicio || !servicio.nombre) {
    return null
  }

  const slugCategoria =
    servicio.categoria === 'branding'
      ? 'branding-identidad'
      : servicio.categoria

  const categoria = categorias.find(
    (item) =>
      item.id === Number(servicio.id_categoria) ||
      item.slug === slugCategoria
  )

  if (!categoria) return null

  return {
    id: servicio.id,
    id_categoria: categoria.id,
    nombre: servicio.nombre,
    slug: servicio.slug || crearSlug(servicio.nombre),
    descripcion: servicio.descripcion || '',
    incluye: servicio.incluye || '',
    precio_desde: Number(
      servicio.precio_desde ??
      servicio.precioDesde ??
      0
    ),
    imagen: servicio.imagen || '',
    fecha_creacion:
      servicio.fecha_creacion ??
      servicio.fechaCreacion ??
      null
  }
}

// ==================================
// ESTADO INICIAL DEL CATÁLOGO
// ==================================

const estadoVacio = {
  agregados: [],
  editados: {},
  ocultos: []
}

function leerCatalogo() {

  if (typeof window === 'undefined') {
    return estadoVacio
  }

  try {

    const guardado = localStorage.getItem(CLAVE_STORAGE)

    if (guardado) {

      const datos = JSON.parse(guardado)

      return {
        agregados: Array.isArray(datos.agregados)
          ? datos.agregados
              .map(normalizarServicio)
              .filter(Boolean)
          : [],

        editados:
          datos.editados &&
          typeof datos.editados === 'object' &&
          !Array.isArray(datos.editados)
            ? datos.editados
            : {},

        ocultos: Array.isArray(datos.ocultos)
          ? datos.ocultos.map(String)
          : []
      }

    }

    // Compatibilidad con los servicios que
    // guardaste antes de implementar edición.

    const anteriores = JSON.parse(
      localStorage.getItem(CLAVE_ANTERIOR) || '[]'
    )

    return {
      ...estadoVacio,
      agregados: Array.isArray(anteriores)
        ? anteriores.map(normalizarServicio).filter(Boolean)
        : []
    }

  } catch (error) {

    console.error(
      'No se pudo leer el catálogo:',
      error
    )

    return estadoVacio
  }
}

// ==================================
// VALIDAR DATOS DEL FORMULARIO
// ==================================

function validarServicio(datos) {

  const categoria = categorias.find(
    (item) => item.id === Number(datos.id_categoria)
  )

  if (!categoria) {
    throw new Error('Selecciona una categoría válida.')
  }

  if (
    !datos.nombre?.trim() ||
    !datos.descripcion?.trim() ||
    !datos.incluye?.trim() ||
    !datos.imagen ||
    !Number.isFinite(Number(datos.precio_desde)) ||
    Number(datos.precio_desde) <= 0
  ) {
    throw new Error(
      'Completa todos los campos del servicio.'
    )
  }

  return {
    id_categoria: categoria.id,
    nombre: datos.nombre.trim(),
    descripcion: datos.descripcion.trim(),
    incluye: datos.incluye.trim(),
    precio_desde: Number(datos.precio_desde),
    imagen: datos.imagen
  }
}

// ==================================
// PROVIDER
// ==================================

export function ServiciosProvider({ children }) {

  const [catalogo, setCatalogo] = useState(leerCatalogo)

  // ==================================
  // COMBINAR SERVICIOS
  // ==================================

  const servicios = useMemo(() => {

    const originales = serviciosBase
      .filter(
        (servicio) =>
          !catalogo.ocultos.includes(String(servicio.id))
      )
      .map((servicio) => ({
        ...servicio,
        ...(catalogo.editados[String(servicio.id)] || {})
      }))

    return [
      ...originales,
      ...catalogo.agregados
    ]

  }, [catalogo])

  // ==================================
  // GUARDAR CAMBIOS DEL CATÁLOGO
  // ==================================

  function guardarCatalogo(actualizado) {

    // Primero persistimos y después actualizamos
    // React para evitar mostrar un falso éxito.

    localStorage.setItem(
      CLAVE_STORAGE,
      JSON.stringify(actualizado)
    )

    setCatalogo(actualizado)
  }

  // ==================================
  // GENERAR SLUG ÚNICO
  // ==================================

  function slugDisponible(nombre, idCategoria, idExcluir = null) {

    const base = crearSlug(nombre) || 'servicio'

    let slug = base
    let numero = 2

    while (
      servicios.some(
        (item) =>
          String(item.id) !== String(idExcluir) &&
          Number(item.id_categoria) === Number(idCategoria) &&
          item.slug === slug
      )
    ) {
      slug = `${base}-${numero}`
      numero++
    }

    return slug
  }

  // ==================================
  // AGREGAR SERVICIO
  // ==================================

  function agregarServicio(datos) {

    const valido = validarServicio(datos)

    const siguienteId = Math.max(
      Date.now(),
      ...servicios.map((item) => Number(item.id) || 0)
    ) + 1

    const nuevoServicio = {
      ...valido,
      id: siguienteId,

      slug: slugDisponible(
        valido.nombre,
        valido.id_categoria
      ),

      fecha_creacion: new Date().toISOString()
    }

    guardarCatalogo({
      ...catalogo,
      agregados: [
        ...catalogo.agregados,
        nuevoServicio
      ]
    })

    return nuevoServicio
  }

  // ==================================
  // EDITAR SERVICIO
  // ==================================

  function editarServicio(id, datos) {

    const actual = servicios.find(
      (item) => String(item.id) === String(id)
    )

    if (!actual) {
      throw new Error('El servicio no existe.')
    }

    const valido = validarServicio(datos)

    const cambioNombre =
      actual.nombre !== valido.nombre

    const cambioCategoria =
      Number(actual.id_categoria) !==
      Number(valido.id_categoria)

    // Mantener la ruta si nombre y categoría
    // no cambiaron.
    const slug =
      cambioNombre || cambioCategoria
        ? slugDisponible(
            valido.nombre,
            valido.id_categoria,
            id
          )
        : actual.slug

    const actualizado = {
      ...actual,
      ...valido,
      slug
    }

    const esAgregado = catalogo.agregados.some(
      (item) => String(item.id) === String(id)
    )

    if (esAgregado) {

      guardarCatalogo({
        ...catalogo,

        agregados: catalogo.agregados.map(
          (item) =>
            String(item.id) === String(id)
              ? actualizado
              : item
        )
      })

    } else {

      // Los originales no se modifican físicamente
      // en servicios.js: guardamos una edición local.
      guardarCatalogo({
        ...catalogo,

        editados: {
          ...catalogo.editados,
          [String(id)]: actualizado
        }
      })

    }

    return actualizado
  }

  // ==================================
  // ELIMINAR SERVICIO
  // ==================================

  function eliminarServicio(id) {

    const existe = servicios.some(
      (item) => String(item.id) === String(id)
    )

    if (!existe) {
      throw new Error('El servicio no existe.')
    }

    const esAgregado = catalogo.agregados.some(
      (item) => String(item.id) === String(id)
    )

    if (esAgregado) {

      // Eliminar servicio creado desde el admin.
      guardarCatalogo({
        ...catalogo,

        agregados: catalogo.agregados.filter(
          (item) => String(item.id) !== String(id)
        )
      })

    } else {

      // Ocultar un servicio original sin alterar
      // el archivo src/data/servicios.js.
      guardarCatalogo({
        ...catalogo,

        ocultos: [
          ...new Set([
            ...catalogo.ocultos,
            String(id)
          ])
        ]
      })

    }

    return true
  }

  // ==================================
  // VALOR COMPARTIDO
  // ==================================

  return (

    <ServiciosContext.Provider
      value={{
        servicios,
        serviciosPersonalizados: catalogo.agregados,
        agregarServicio,
        editarServicio,
        eliminarServicio
      }}
    >

      {children}

    </ServiciosContext.Provider>

  )
}

// ==================================
// HOOK PERSONALIZADO
// ==================================

export function useServicios() {

  const contexto = useContext(ServiciosContext)

  if (!contexto) {
    throw new Error(
      'useServicios debe utilizarse dentro de ServiciosProvider'
    )
  }

  return contexto
}
