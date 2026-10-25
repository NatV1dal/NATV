
import { Link } from 'react-router-dom'
import {
  FaUser,
  FaPenNib,
  FaVideo,
  FaHeart
} from 'react-icons/fa6'

import './PerfilCliente.css'

// Datos de demostración.
// Posteriormente vendrán desde la API.

const usuarioDemo = {
  nombre: 'Ariel'
}

const solicitudesDemo = [
  {
    id: 1,
    nombre: 'Creación de marca',
    numero: 'NXXXX',
    descripcion: 'Diseño y desarrollo de identidad de marca.',
    categoria: 'branding',
    color: '#1B3C5B'
  },
  {
    id: 2,
    nombre: 'Creación de marca',
    numero: 'NXXXX',
    descripcion: 'Desarrollo de propuesta de identidad visual.',
    categoria: 'branding',
    color: '#1B3C5B'
  }
]

const favoritosDemo = [
  {
    id: 1,
    nombre: 'Creación de marca',
    descripcion: 'Diseño de identidad visual para tu proyecto.',
    categoria: 'branding',
    color: '#1B3C5B'
  },
  {
    id: 2,
    nombre: 'Toma aérea con dron',
    descripcion: 'Fotografía y video desde una perspectiva aérea.',
    categoria: 'audiovisual',
    color: '#2D3CC9'
  }
]

// Ícono según la categoría
function IconoServicio({ categoria }) {
  if (categoria === 'audiovisual') {
    return <FaVideo aria-hidden="true" />
  }

  return <FaPenNib aria-hidden="true" />
}

// Tarjetas reutilizables
function TarjetaPerfil({ servicio, tipo }) {

  const esSolicitud = tipo === 'solicitud'

  function manejarAccion() {
    if (esSolicitud) {
      window.alert(
        'Próximamente podrás consultar el estado de tus solicitudes.'
      )
    } else {
      window.alert(
        'La solicitud de servicios estará disponible al conectar el backend.'
      )
    }
  }

  return (
    <article
      className="perfil-tarjeta-servicio"
      style={{
        '--color-tarjeta': servicio.color
      }}
    >

      <div className="perfil-tarjeta-informacion">

        <div className="perfil-tarjeta-icono">
          <IconoServicio categoria={servicio.categoria} />
        </div>

        <div className="perfil-tarjeta-textos">

          <h3>{servicio.nombre}</h3>

          {esSolicitud && (
            <span className="perfil-numero-pedido">
              N.º Pedido: {servicio.numero}
            </span>
          )}

          <p>{servicio.descripcion}</p>

        </div>

        <FaHeart
          className="perfil-tarjeta-corazon"
          aria-hidden="true"
        />

      </div>

      <button
        type="button"
        className="perfil-tarjeta-boton"
        onClick={manejarAccion}
      >
        {esSolicitud
          ? 'Ver estado'
          : 'Solicitar servicio'}
      </button>

    </article>
  )
}

function PerfilCliente() {

  function editarDatos() {
    window.alert(
      'Próximamente podrás editar los datos de tu perfil.'
    )
  }

  return (
    <main className="perfil-pagina">

      <div className="perfil-contenedor">

        {/* ==================================
            BIENVENIDA
        ================================== */}

        <section className="perfil-bienvenida">

          <div className="perfil-bienvenida-texto">

            <h1>
              ¡Hola, {usuarioDemo.nombre}!
            </h1>

            <p>
              Bienvenido a tu espacio.
              Aquí podrás administrar tus solicitudes,
              servicios favoritos y datos personales.
            </p>

          </div>

          {/* Fotografía del usuario */}
          <div className="perfil-avatar-marco">

            <div className="perfil-avatar">
              <FaUser aria-label="Avatar predeterminado" />
            </div>

          </div>

          <button
            type="button"
            className="perfil-editar-boton"
            onClick={editarDatos}
          >
            Editar datos
          </button>

        </section>

        {/* ==================================
            SOLICITUDES
        ================================== */}

        <section
          className="perfil-seccion"
          id="solicitudes"
        >

          <h2>Solicitudes</h2>

          <div className="perfil-tarjetas-grid">

            {solicitudesDemo.map((solicitud) => (

              <TarjetaPerfil
                key={solicitud.id}
                servicio={solicitud}
                tipo="solicitud"
              />

            ))}

          </div>

        </section>

        {/* ==================================
            FAVORITOS
        ================================== */}

        <section
          className="perfil-seccion"
          id="favoritos"
        >

          <h2>Mis favoritos</h2>

          <div className="perfil-tarjetas-grid">

            {favoritosDemo.map((favorito) => (

              <TarjetaPerfil
                key={favorito.id}
                servicio={favorito}
                tipo="favorito"
              />

            ))}

          </div>

          <div className="perfil-mas-servicios">

            <Link
              to="/#servicios"
              className="perfil-ver-mas"
            >
              Ver más servicios
            </Link>

          </div>

        </section>

        {/* ==================================
            DECORACIÓN INFERIOR
        ================================== */}

        <div
          className="perfil-puntos"
          aria-hidden="true"
        />

      </div>

    </main>
  )
}

export default PerfilCliente
