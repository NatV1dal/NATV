
import { Link, useNavigate } from 'react-router-dom'
import img404 from '../assets/images/errores/img404_fn.webp'

import './Pagina404.css'

// ==========================================
// PÁGINA DE ERROR 404
// ==========================================

function Pagina404() {

  const navigate = useNavigate()

  // ==================================
  // VOLVER A LA PÁGINA ANTERIOR
  // ==================================

  function volverAtras() {

    // Consultar el historial de navegación
    // administrado por React Router
    const indiceHistorial = window.history.state?.idx

    // Si existe una navegación anterior
    // dentro de nuestra aplicación, retroceder
    if (
      typeof indiceHistorial === 'number' &&
      indiceHistorial > 0
    ) {

      navigate(-1)

    } else {

      // Si ingresó directamente a esta página,
      // redirigir al inicio de NATV
      navigate('/', { replace: true })

    }

  }

  return (
    <main className="pagina404">

      <section className="pagina404-contenedor">

        {/* ==================================
            ILUSTRACIÓN 404
        ================================== */}

        <div className="pagina404-ilustracion">

          <img
            src={img404}
            alt="Dos perritos acompañando el número 404"
          />

        </div>

        {/* ==================================
            TÍTULO
        ================================== */}

        <h1 className="pagina404-titulo">
          ¡Ups! Esta página no existe
        </h1>

        {/* ==================================
            DESCRIPCIÓN
        ================================== */}

        <p className="pagina404-descripcion">

         Parece que seguimos las huellitas equivocadas...

          <span>
            ¡No te preocupes! Las buenas ideas siempre encuentran su camino.
          </span>

        </p>

        {/* ==================================
            BOTONES
        ================================== */}

        <div className="pagina404-acciones">

          {/* VOLVER AL INICIO */}

          <Link
            to="/"
            className="pagina404-boton pagina404-boton-principal"
          >
            Volver al home
          </Link>

          {/* VOLVER A LA PÁGINA ANTERIOR */}

          <button
            type="button"
            className="pagina404-boton pagina404-boton-secundario"
            onClick={volverAtras}
          >
            Página anterior
          </button>

        </div>

      </section>

      {/* ==================================
          DECORACIÓN INFERIOR
      ================================== */}

      <div
        className="pagina404-puntos"
        aria-hidden="true"
      />

    </main>
  )
}

export default Pagina404
