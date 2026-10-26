
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  FaUser,
  FaImage,
  FaHeart,
  FaChevronDown
} from 'react-icons/fa6'

import './PerfilCliente.css'
import './AgregarServicio.css'

// ==================================
// CATEGORÍAS NATV
// ==================================

const categorias = [
  {
    id: 'desarrollo-web',
    nombre: 'Desarrollo web',
    color: 'var(--celeste-natv)'
  },
  {
    id: 'diseno-grafico',
    nombre: 'Diseño gráfico',
    color: 'var(--morado-natv)'
  },
  {
    id: 'branding',
    nombre: 'Branding e identidad',
    color: 'var(--azul-natv)'
  },
  {
    id: 'ilustraciones',
    nombre: 'Ilustraciones',
    color: 'var(--color-coral)'
  },
  {
    id: 'fotografia',
    nombre: 'Fotografía',
    color: 'var(--color-amarillo)'
  },
  {
    id: 'audiovisual',
    nombre: 'Audiovisual',
    color: 'var(--color-azul-fuerte)'
  }
]

// ==================================
// FORMULARIO INICIAL
// ==================================

const formularioInicial = {
  nombre: '',
  categoria: '',
  descripcion: '',
  incluye: '',
  precioDesde: ''
}

// ==================================
// OPTIMIZAR IMAGEN PARA DEMOSTRACIÓN
// ==================================

function optimizarImagen(archivo) {

  return new Promise((resolve, reject) => {

    const urlTemporal = URL.createObjectURL(archivo)
    const imagen = new Image()

    imagen.onload = () => {

      URL.revokeObjectURL(urlTemporal)

      try {

        const escala = Math.min(
          1,
          900 / imagen.width,
          600 / imagen.height
        )

        const ancho = Math.max(
          1,
          Math.round(imagen.width * escala)
        )

        const alto = Math.max(
          1,
          Math.round(imagen.height * escala)
        )

        const canvas = document.createElement('canvas')

        canvas.width = ancho
        canvas.height = alto

        const contexto = canvas.getContext('2d')

        if (!contexto) {
          throw new Error('No se pudo procesar la imagen.')
        }

        // Fondo blanco para imágenes transparentes
        contexto.fillStyle = '#FFFFFF'
        contexto.fillRect(0, 0, ancho, alto)

        contexto.drawImage(
          imagen,
          0,
          0,
          ancho,
          alto
        )

        resolve(
          canvas.toDataURL('image/jpeg', 0.78)
        )

      } catch (error) {
        reject(error)
      }

    }

    imagen.onerror = () => {
      URL.revokeObjectURL(urlTemporal)
      reject(new Error('No se pudo abrir la imagen.'))
    }

    imagen.src = urlTemporal

  })
}

// ==================================
// PÁGINA: AGREGAR SERVICIO
// ==================================

function AgregarServicio() {

  const [formulario, setFormulario] = useState({
    ...formularioInicial
  })

  const [imagen, setImagen] = useState('')
  const [nombreImagen, setNombreImagen] = useState('')
  const [cargandoImagen, setCargandoImagen] = useState(false)

  const [aviso, setAviso] = useState(null)

  const archivoRef = useRef(null)

  // ==================================
  // CATEGORÍA SELECCIONADA
  // ==================================

  const categoriaActual = categorias.find(
    (categoria) => categoria.id === formulario.categoria
  )

  const colorCategoria =
    categoriaActual?.color || 'var(--celeste-natv)'

  // ==================================
  // CAMBIAR DATOS DEL FORMULARIO
  // ==================================

  function manejarCambio(evento) {

    const { name, value } = evento.target

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }))

    setAviso(null)

  }

  // ==================================
  // ADJUNTAR IMAGEN
  // ==================================

  async function manejarImagen(evento) {

    const archivo = evento.target.files?.[0]

    if (!archivo) return

    const formatosPermitidos = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ]

    if (!formatosPermitidos.includes(archivo.type)) {

      setAviso({
        tipo: 'error',
        texto: 'Solo puedes adjuntar imágenes JPG, PNG o WEBP.'
      })

      evento.target.value = ''
      return
    }

    if (archivo.size > 5 * 1024 * 1024) {

      setAviso({
        tipo: 'error',
        texto: 'La imagen no puede superar los 5 MB.'
      })

      evento.target.value = ''
      return
    }

    setCargandoImagen(true)
    setAviso(null)

    try {

      const imagenOptimizada = await optimizarImagen(archivo)

      setImagen(imagenOptimizada)
      setNombreImagen(archivo.name)

    } catch {

      setAviso({
        tipo: 'error',
        texto: 'No se pudo procesar la imagen seleccionada.'
      })

      evento.target.value = ''

    } finally {

      setCargandoImagen(false)

    }

  }

  // ==================================
  // BORRAR FORMULARIO
  // ==================================

  function borrarServicio() {

    setFormulario({ ...formularioInicial })
    setImagen('')
    setNombreImagen('')
    setAviso(null)

    if (archivoRef.current) {
      archivoRef.current.value = ''
    }

  }

  // ==================================
  // FORMATEAR PRECIO CHILENO
  // ==================================

  const precioFormateado =
    Number(formulario.precioDesde) > 0
      ? new Intl.NumberFormat('es-CL').format(
          Number(formulario.precioDesde)
        )
      : '000.000'

  // ==================================
  // GUARDAR SERVICIO - DEMOSTRACIÓN
  // ==================================

  function guardarServicio(evento) {

    evento.preventDefault()

    if (cargandoImagen) {
      return
    }

    if (
      !formulario.nombre.trim() ||
      !formulario.categoria ||
      !formulario.descripcion.trim() ||
      !formulario.incluye.trim() ||
      Number(formulario.precioDesde) <= 0
    ) {

      setAviso({
        tipo: 'error',
        texto: 'Completa todos los campos correctamente.'
      })

      return
    }

    if (!imagen) {

      setAviso({
        tipo: 'error',
        texto: 'Debes adjuntar una imagen del servicio.'
      })

      return
    }

    // Crear el servicio con sus datos
    const nuevoServicio = {
      id: Date.now(),
      nombre: formulario.nombre.trim(),
      categoria: formulario.categoria,
      nombreCategoria: categoriaActual.nombre,
      descripcion: formulario.descripcion.trim(),
      incluye: formulario.incluye.trim(),
      precioDesde: Number(formulario.precioDesde),
      imagen: imagen,
      nombreImagen: nombreImagen,
      fechaCreacion: new Date().toISOString()
    }

    try {

      // Guardar los servicios de demostración
      // en el navegador, sin utilizar una API.

      const serviciosGuardados = JSON.parse(
        localStorage.getItem('natv_servicios_admin') || '[]'
      )

      const lista = Array.isArray(serviciosGuardados)
        ? serviciosGuardados
        : []

      localStorage.setItem(
        'natv_servicios_admin',
        JSON.stringify([
          ...lista,
          nuevoServicio
        ])
      )

      setAviso({
        tipo: 'exito',
        texto:
          '¡Servicio guardado en la demostración! ' +
          'Todavía no se publica en el catálogo público.'
      })

    } catch {

      setAviso({
        tipo: 'error',
        texto:
          'No pudimos guardar el servicio en el navegador. ' +
          'Revisa el espacio de almacenamiento disponible.'
      })

    }

  }

  // ==================================
  // INTERFAZ
  // ==================================

  return (

    <main className="perfil-pagina admin-pagina agregar-pagina">

      <div className="perfil-contenedor">

        {/* ==================================
            BIENVENIDA
        ================================== */}

        <section className="perfil-bienvenida">

          <div className="perfil-bienvenida-texto">

            <h1>¡Hola, Natalie!</h1>

            <p>
              Administra los servicios disponibles
              en la plataforma NATV.
            </p>

          </div>

          <div className="perfil-avatar-marco">

            <div className="perfil-avatar">
              <FaUser aria-label="Avatar predeterminado" />
            </div>

          </div>

          <Link
            to="/perfil/editar"
            className="perfil-editar-boton"
          >
            Editar datos
          </Link>

        </section>

        {/* ==================================
            FORMULARIO AGREGAR SERVICIO
        ================================== */}

        <section className="agregar-contenedor">

          <h2>Agregar servicio</h2>

          <form
            className="agregar-formulario"
            onSubmit={guardarServicio}
          >

            {/* NOMBRE DEL SERVICIO */}

            <div className="agregar-campo">

              <label
                className="agregar-etiqueta"
                htmlFor="agregar-nombre"
              >
                Nombre del servicio
              </label>

              <input
                id="agregar-nombre"
                name="nombre"
                type="text"
                maxLength={100}
                placeholder="Nombre del servicio"
                value={formulario.nombre}
                onChange={manejarCambio}
                required
              />

            </div>

            {/* CATEGORÍA */}

            <div className="agregar-campo">

              <label
                className="agregar-etiqueta"
                htmlFor="agregar-categoria"
              >
                Categoría
              </label>

              <div className="agregar-select">

                <select
                  id="agregar-categoria"
                  name="categoria"
                  value={formulario.categoria}
                  onChange={manejarCambio}
                  required
                >

                  <option value="">
                    Seleccionar categoría
                  </option>

                  {categorias.map((categoria) => (

                    <option
                      key={categoria.id}
                      value={categoria.id}
                    >
                      {categoria.nombre}
                    </option>

                  ))}

                </select>

                <FaChevronDown aria-hidden="true" />

              </div>

            </div>

            {/* DESCRIPCIÓN */}

            <div className="agregar-campo">

              <label
                className="agregar-etiqueta"
                htmlFor="agregar-descripcion"
              >
                Descripción del servicio
              </label>

              <textarea
                id="agregar-descripcion"
                name="descripcion"
                rows={4}
                maxLength={1500}
                placeholder="Descripción del servicio"
                value={formulario.descripcion}
                onChange={manejarCambio}
                required
              />

            </div>

            {/* ¿QUÉ INCLUYE? */}

            <div className="agregar-campo">

              <label
                className="agregar-etiqueta"
                htmlFor="agregar-incluye"
              >
                ¿Qué incluye?
              </label>

              <textarea
                id="agregar-incluye"
                name="incluye"
                rows={3}
                maxLength={1500}
                placeholder="¿Qué incluye?"
                value={formulario.incluye}
                onChange={manejarCambio}
                required
              />

            </div>

            {/* PRECIO DESDE */}

            <div className="agregar-campo">

              <label
                className="agregar-etiqueta"
                htmlFor="agregar-precio"
              >
                Precio desde (CLP)
              </label>

              <input
                id="agregar-precio"
                name="precioDesde"
                type="number"
                min="1"
                step="1"
                placeholder="Precio desde"
                value={formulario.precioDesde}
                onChange={manejarCambio}
                required
              />

            </div>

            {/* ADJUNTAR IMAGEN */}

            <div className="agregar-campo">

              <span className="agregar-etiqueta">
                Imagen del servicio
              </span>

              <label
                htmlFor="agregar-imagen"
                className="agregar-adjuntar"
              >

                <span>
                  {cargandoImagen
                    ? 'Procesando imagen...'
                    : nombreImagen || 'Adjuntar imagen'}
                </span>

                <FaImage aria-hidden="true" />

                <input
                  ref={archivoRef}
                  id="agregar-imagen"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={manejarImagen}
                  className="agregar-input-archivo"
                />

              </label>

              <small className="agregar-ayuda">
                JPG, PNG o WEBP. Máximo 5 MB.
              </small>

            </div>

            {/* ==================================
                PREVISUALIZACIÓN
            ================================== */}

            <div className="agregar-previa-seccion">

              <h3>Previsualización</h3>

              <div
                className="agregar-card-previa"
                style={{
                  '--agregar-color': colorCategoria
                }}
              >

                {/* IMAGEN */}

                <div className="agregar-previa-imagen">

                  {imagen ? (

                    <img
                      src={imagen}
                      alt="Vista previa del servicio"
                    />

                  ) : (

                    <FaImage
                      className="agregar-imagen-placeholder"
                      aria-hidden="true"
                    />

                  )}

                  {/* ICONO DE CATEGORÍA */}

                  <span
                    className="agregar-categoria-icono"
                    aria-hidden="true"
                  >
                    <FaImage />
                  </span>

                  {/* FAVORITO DECORATIVO */}

                  <span
                    className="agregar-favorito"
                    aria-hidden="true"
                  >
                    <FaHeart />
                  </span>

                </div>

                {/* INFORMACIÓN */}

                <div className="agregar-previa-contenido">

                  <h4>
                    {formulario.nombre.trim() ||
                      'Nombre del servicio'}
                  </h4>

                  <p className="agregar-previa-categoria">
                    {categoriaActual?.nombre ||
                      'Categoría'}
                  </p>

                  <p className="agregar-previa-descripcion">
                    {formulario.descripcion.trim() ||
                      'Aquí aparecerá la descripción del servicio.'}
                  </p>

                  <strong className="agregar-previa-subtitulo">
                    ¿Qué incluye?
                  </strong>

                  <p className="agregar-previa-incluye">
                    {formulario.incluye.trim() ||
                      'Aquí aparecerán las características del servicio.'}
                  </p>

                  <div className="agregar-previa-precio">

                    <span>Valor desde:</span>

                    <strong>
                      ${precioFormateado}.-
                    </strong>

                  </div>

                  {/* BOTÓN VISUAL DE LA TARJETA */}

                  <div
                    className="agregar-previa-boton"
                    aria-label="Botón de muestra: Solicitar servicio"
                  >
                    Solicitar servicio
                  </div>

                </div>

              </div>

              <p className="agregar-previa-nota">
                Esta tarjeta es una previsualización.
              </p>

            </div>

            {/* ==================================
                AVISO
            ================================== */}

            {aviso && (

              <p
                className={
                  `agregar-aviso agregar-aviso-${aviso.tipo}`
                }
                role="status"
              >
                {aviso.texto}
              </p>

            )}

            {/* ==================================
                BOTONES
            ================================== */}

            <div className="agregar-acciones">

              <button
                type="button"
                className="agregar-borrar"
                onClick={borrarServicio}
              >
                Borrar servicio
              </button>

              <button
                type="submit"
                className="agregar-guardar"
                disabled={cargandoImagen}
              >
                {cargandoImagen
                  ? 'Procesando...'
                  : 'Guardar servicio'}
              </button>

            </div>

          </form>

        </section>

        {/* PUNTOS DECORATIVOS */}

        <div
          className="perfil-puntos"
          aria-hidden="true"
        />

      </div>

    </main>
  )
}

export default AgregarServicio
