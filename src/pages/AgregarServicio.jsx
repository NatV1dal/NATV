
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  FaUser,
  FaImage,
  FaHeart,
  FaChevronDown,
  FaMagnifyingGlass,
  FaPen,
  FaTrashCan
} from 'react-icons/fa6'

import { categorias } from '../data/categorias'
import { useServicios } from '../context/ServiciosContext'

import './PerfilCliente.css'
import './AgregarServicio.css'

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
// OPTIMIZAR IMAGEN
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

        const canvas = document.createElement('canvas')

        canvas.width = Math.max(
          1,
          Math.round(imagen.width * escala)
        )

        canvas.height = Math.max(
          1,
          Math.round(imagen.height * escala)
        )

        const contexto = canvas.getContext('2d')

        if (!contexto) {
          throw new Error('No se pudo procesar la imagen.')
        }

        contexto.fillStyle = '#FFFFFF'

        contexto.fillRect(
          0,
          0,
          canvas.width,
          canvas.height
        )

        contexto.drawImage(
          imagen,
          0,
          0,
          canvas.width,
          canvas.height
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
// PÁGINA AGREGAR / ADMINISTRAR SERVICIOS
// ==================================

function AgregarServicio() {

  const {
    servicios,
    serviciosPersonalizados,
    agregarServicio,
    editarServicio,
    eliminarServicio
  } = useServicios()

  // ==================================
  // ESTADOS DEL FORMULARIO
  // ==================================

  const [formulario, setFormulario] = useState({
    ...formularioInicial
  })

  const [imagen, setImagen] = useState('')
  const [nombreImagen, setNombreImagen] = useState('')
  const [cargandoImagen, setCargandoImagen] = useState(false)

  const [aviso, setAviso] = useState(null)

  // Buscar y seleccionar servicios
  const [busqueda, setBusqueda] = useState('')
  const [idEditando, setIdEditando] = useState(null)
  const [mostrarBuscador, setMostrarBuscador] = useState(false)

  const archivoRef = useRef(null)
  const formularioRef = useRef(null)

  // ==================================
  // CATEGORÍA ACTUAL
  // ==================================

  const categoriaActual = categorias.find(
    (item) => item.id === Number(formulario.categoria)
  )

    const colorCategoria =
      categoriaActual?.color || 'var(--gris-oscuro)'


  // ==================================
  // RESULTADOS DE BÚSQUEDA
  // ==================================

  const termino = busqueda.trim().toLocaleLowerCase('es-CL')

    const serviciosEncontrados = termino
      ? servicios.filter(
          (servicio) =>
            servicio.nombre
              .toLocaleLowerCase('es-CL')
              .includes(termino)
        )
      : []


  // ==================================
  // ACTUALIZAR FORMULARIO
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

    const permitidos = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ]

    if (!permitidos.includes(archivo.type)) {

      setAviso({
        tipo: 'error',
        texto: 'Selecciona una imagen JPG, PNG o WEBP.'
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

      const resultado = await optimizarImagen(archivo)

      setImagen(resultado)
      setNombreImagen(archivo.name)

    } catch {

      setAviso({
        tipo: 'error',
        texto: 'No se pudo procesar la imagen.'
      })

    } finally {

      setCargandoImagen(false)
      evento.target.value = ''

    }
  }

  // ==================================
  // LIMPIAR FORMULARIO
  // ==================================

  function limpiarFormulario() {

    setFormulario({ ...formularioInicial })
    setImagen('')
    setNombreImagen('')
    setIdEditando(null)
    setAviso(null)

    if (archivoRef.current) {
      archivoRef.current.value = ''
    }
  }

  // ==================================
  // SELECCIONAR SERVICIO PARA EDITAR
  // ==================================

  function seleccionarServicio(servicio) {

    if (cargandoImagen) return
    setMostrarBuscador(false)
    setBusqueda('')

    setIdEditando(servicio.id)

    setFormulario({
      nombre: servicio.nombre || '',
      categoria: String(servicio.id_categoria || ''),
      descripcion: servicio.descripcion || '',
      incluye: servicio.incluye || '',
      precioDesde: String(
        servicio.precio_desde ?? ''
      )
    })

    setImagen(servicio.imagen || '')
    setNombreImagen(
      servicio.imagen ? 'Imagen actual del servicio' : ''
    )

    setAviso(null)

    if (archivoRef.current) {
      archivoRef.current.value = ''
    }

    formularioRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }

  // ==================================
  // ELIMINAR SERVICIO
  // ==================================

  function confirmarEliminacion(servicio) {

    if (cargandoImagen) return

    const esPersonalizado = serviciosPersonalizados.some(
      (item) => String(item.id) === String(servicio.id)
    )

    const explicacion = esPersonalizado
      ? 'Este servicio se eliminará de los datos locales guardados.'
      : 'Este servicio original se ocultará del catálogo en este navegador.'

    const confirmado = window.confirm(
      `¿Quieres eliminar "${servicio.nombre}"?\n\n` +
      `${explicacion}\n\n` +
      'Esta acción no se puede deshacer desde esta pantalla.'
    )

    if (!confirmado) return

    try {

      eliminarServicio(servicio.id)

      if (String(idEditando) === String(servicio.id)) {
        limpiarFormulario()
      }

      setAviso({
        tipo: 'exito',
        texto: `El servicio "${servicio.nombre}" se retiró del catálogo local.`
      })

    } catch (error) {

      setAviso({
        tipo: 'error',
        texto: error.message
      })

    }
  }

  // ==================================
  // PRECIO PARA PREVISUALIZACIÓN
  // ==================================

  const precioFormateado =
    Number(formulario.precioDesde) > 0
      ? new Intl.NumberFormat('es-CL').format(
          Number(formulario.precioDesde)
        )
      : '000.000'

  // ==================================
  // GUARDAR SERVICIO
  // ==================================

  function guardarServicio(evento) {

    evento.preventDefault()
    setAviso(null)

    if (cargandoImagen) return

    if (
      !formulario.nombre.trim() ||
      !formulario.categoria ||
      !formulario.descripcion.trim() ||
      !formulario.incluye.trim() ||
      !Number.isFinite(Number(formulario.precioDesde)) ||
      Number(formulario.precioDesde) <= 0 ||
      !imagen
    ) {

      setAviso({
        tipo: 'error',
        texto: 'Completa todos los campos y adjunta una imagen.'
      })

      return
    }

    const datos = {
      nombre: formulario.nombre,
      id_categoria: Number(formulario.categoria),
      descripcion: formulario.descripcion,
      incluye: formulario.incluye,
      precio_desde: Number(formulario.precioDesde),
      imagen
    }

    try {

      let resultado

      if (idEditando !== null) {

        // ACTUALIZAR SERVICIO EXISTENTE
        resultado = editarServicio(idEditando, datos)

        setAviso({
          tipo: 'exito',
          texto: `¡Los cambios de "${resultado.nombre}" se guardaron correctamente!`
        })

      } else {

        // CREAR NUEVO SERVICIO
        resultado = agregarServicio(datos)

        // Pasamos a modo edición para evitar
        // crear duplicados al guardar otra vez.
        setIdEditando(resultado.id)

        setAviso({
          tipo: 'exito',
          texto: `¡Servicio "${resultado.nombre}" creado correctamente!`
        })
      }

    } catch (error) {

      setAviso({
        tipo: 'error',
        texto:
          error.message ||
          'No se pudo guardar el servicio.'
      })

    }
  }

  // ==================================
  // VISTA
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
            state={{ desdeAdmin: true }}
            className="perfil-editar-boton"
          >
            Editar datos
          </Link>

        </section>

        {/* ==================================
            CONTENEDOR PRINCIPAL
        ================================== */}

        <section className="agregar-contenedor">

          
{/* ==================================
    ENCABEZADO AGREGAR SERVICIOS
================================== */}

<div className="agregar-cabecera">

  <h2>Agregar servicios</h2>

  <button
    type="button"
    className="agregar-buscar-boton"
    onClick={() => {
      setMostrarBuscador((anterior) => !anterior)
      setBusqueda('')
    }}
    aria-expanded={mostrarBuscador}
    aria-controls="panel-busqueda-servicios"
  >

    <FaMagnifyingGlass aria-hidden="true" />

    <span>Buscar servicio</span>

  </button>

</div>

{/* ==================================
    BUSCADOR DESPLEGABLE
================================== */}

{mostrarBuscador && (

  <div
    id="panel-busqueda-servicios"
    className="agregar-administrar"
  >

    {/* CAMPO DE BÚSQUEDA */}

    <div className="agregar-buscador">

      <FaMagnifyingGlass aria-hidden="true" />

      <input
        type="search"
        placeholder="Escribe el nombre del servicio..."
        aria-label="Buscar servicio por nombre"
        value={busqueda}
        onChange={(evento) =>
          setBusqueda(evento.target.value)
        }
        autoFocus
      />

    </div>

    {/* ==================================
        RESULTADOS
        SOLO SI ESCRIBE ALGO
    ================================== */}

    {termino && (

      <div className="agregar-resultados">

        <p className="agregar-resultados-cantidad">
          {serviciosEncontrados.length} servicio(s) encontrado(s)
        </p>

        {serviciosEncontrados.length > 0 ? (

          serviciosEncontrados.map((servicio) => {

            const categoria = categorias.find(
              (item) =>
                item.id === Number(servicio.id_categoria)
            )

            return (

              <div
                className="agregar-servicio-item"
                key={servicio.id}
              >

                {/* DATOS DEL SERVICIO */}

                <div className="agregar-servicio-info">

                  <strong>
                    {servicio.nombre}
                  </strong>

                  <span>
                    {categoria?.nombre || 'Sin categoría'}
                  </span>

                </div>

                {/* BOTONES */}

                <div className="agregar-servicio-opciones">

                  <button
                    type="button"
                    className="agregar-opcion-editar"
                    onClick={() =>
                      seleccionarServicio(servicio)
                    }
                    disabled={cargandoImagen}
                  >
                    <FaPen aria-hidden="true" />
                    Editar
                  </button>

                  <button
                    type="button"
                    className="agregar-opcion-eliminar"
                    onClick={() =>
                      confirmarEliminacion(servicio)
                    }
                    disabled={cargandoImagen}
                  >
                    <FaTrashCan aria-hidden="true" />
                    Eliminar
                  </button>

                </div>

              </div>

            )
          })

        ) : (

          <p className="agregar-sin-resultados">
            No se encontraron servicios con ese nombre.
          </p>

        )}

      </div>

    )}

  </div>

)}


          {/* ==================================
              FORMULARIO
          ================================== */}

          <div
            ref={formularioRef}
            className="agregar-formulario-seccion"
          >
            
            {idEditando !== null && (

              <div className="agregar-formulario-titulo">

                <h2>Modificar servicio</h2>

                <button
                  type="button"
                  className="agregar-nuevo-boton"
                  onClick={limpiarFormulario}
                >
                  + Nuevo servicio
                </button>

              </div>

            )}


            <form
              className="agregar-formulario"
              onSubmit={guardarServicio}
            >

              {/* NOMBRE */}

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

              {/* QUÉ INCLUYE */}

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

              {/* PRECIO */}

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

              {/* IMAGEN */}

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

                    <span
                      className="agregar-categoria-icono"
                      aria-hidden="true"
                    >
                      <FaImage />
                    </span>

                    <span
                      className="agregar-favorito"
                      aria-hidden="true"
                    >
                      <FaHeart />
                    </span>

                  </div>

                  <div className="agregar-previa-contenido">

                    <h4>
                      {formulario.nombre.trim() ||
                        'Nombre del servicio'}
                    </h4>

                    <p className="agregar-previa-categoria">
                      {categoriaActual?.nombre || 'Categoría'}
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

                    <div className="agregar-previa-boton">
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

              {/* VER CATEGORÍA */}

              {aviso?.tipo === 'exito' && categoriaActual && (

                <Link
                  to={`/servicios/${categoriaActual.slug}`}
                  className="agregar-ver-categoria"
                >
                  Ver servicios de {categoriaActual.nombre}
                </Link>

              )}

              {/* ==================================
                  BOTONES
              ================================== */}

              <div className="agregar-acciones">

                <button
                  type="button"
                  className="agregar-borrar"
                  onClick={limpiarFormulario}
                >
                  {idEditando !== null
                    ? 'Cancelar edición'
                    : 'Limpiar formulario'}
                </button>

                <button
                  type="submit"
                  className="agregar-guardar"
                  disabled={cargandoImagen}
                >
                  {cargandoImagen
                    ? 'Procesando...'
                    : idEditando !== null
                      ? 'Guardar cambios'
                      : 'Guardar servicio'}
                </button>

              </div>

            </form>

          </div>

        </section>

        <div
          className="perfil-puntos"
          aria-hidden="true"
        />

      </div>

    </main>

  )
}

export default AgregarServicio
