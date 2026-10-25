
import { Link, useParams } from 'react-router-dom'
import { FaUser } from 'react-icons/fa6'

import { solicitudesDemo } from '../data/solicitudesDemo'

import './PerfilCliente.css'
import './EstadoSolicitud.css'

// Etapas del seguimiento
const etapas = [
  {
    nombre: 'Solicitado',
    descripcion:
      'Tu solicitud fue enviada correctamente. Pronto revisaremos los detalles y te contactaremos.',
    color: 'var(--color-solicitud)'
  },
  {
    nombre: 'Cotizado',
    descripcion:
      'Te enviaremos una propuesta con el alcance del servicio, plazos y valores para tu aprobación.',
    color: 'var(--color-cotizar)'
  },
  {
    nombre: 'Confirmado',
    descripcion:
      'Tu servicio se encuentra confirmado luego de aceptar la cotización y realizar el pago inicial del 50%.',
    color: 'var(--color-confirmado)'
  },
  {
    nombre: 'En Proceso',
    descripcion:
      'Estamos trabajando en tu proyecto de acuerdo a lo definido. Te mantendremos informado del avance.'
  },
  {
    nombre: 'Correcciones',
    descripcion:
      'Te compartiremos avances para que puedas revisar y solicitar ajustes si es necesario.'
  },
  {
    nombre: 'Entrega De Originales',
    descripcion:
      'Te entregaremos los archivos finales del proyecto y se gestionará el pago de la segunda mitad del servicio.'
  },
  {
    nombre: 'Finalizado',
    descripcion:
      'Tu proyecto ha sido finalizado y entregado correctamente. ¡Gracias por confiar en NATV!'
  }
]

function EstadoSolicitud() {

  const { id } = useParams()

  // Buscar solicitud por su ID
  const solicitud = solicitudesDemo.find(
    (item) => item.id === Number(id)
  )

  // Solicitud inexistente
  if (!solicitud) {
    return (
      <main className="estado-no-encontrado">
        <h1>Solicitud no encontrada</h1>
        <p>No encontramos la solicitud seleccionada.</p>
        <Link to="/perfil">
          Volver a mi perfil
        </Link>
      </main>
    )
  }

  // Obtener el índice del estado actual
  const indiceActual = etapas.findIndex(
    (etapa) => etapa.nombre === solicitud.estado
  )

  return (
    <main className="perfil-pagina estado-solicitud-pagina">

      <div className="perfil-contenedor">

        {/* ==================================
            BIENVENIDA
        ================================== */}

        <section className="perfil-bienvenida">

          <div className="perfil-bienvenida-texto">

            <h1>¡Hola, Ariel!</h1>

            <p>
              Bienvenido a tu espacio.
              Aquí podrás administrar tus solicitudes,
              servicios favoritos y datos personales.
            </p>

          </div>

          {/* Avatar */}
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
            ESTADO DE SOLICITUD
        ================================== */}

        <section className="estado-panel">

          <h2>
            Estado de mi solicitud | N° Pedido: {solicitud.numero}
          </h2>

          <ol
            className="estado-linea-tiempo"
            aria-label="Seguimiento de la solicitud"
          >

            {etapas.map((etapa, indice) => {

              const alcanzada = indice <= indiceActual
              const actual = indice === indiceActual

              return (
                <li
                  key={etapa.nombre}
                  className={
                    alcanzada
                      ? 'estado-etapa estado-etapa-activa'
                      : 'estado-etapa'
                  }
                  style={
                    alcanzada
                      ? { '--color-etapa': etapa.color }
                      : undefined
                  }
                  aria-current={
                    actual ? 'step' : undefined
                  }
                >

                  <h3>{etapa.nombre}</h3>

                  <p>{etapa.descripcion}</p>

                </li>
              )

            })}

          </ol>

        </section>

        {/* ==================================
            PUNTOS DECORATIVOS
        ================================== */}

        <div
          className="perfil-puntos"
          aria-hidden="true"
        />

      </div>

    </main>
  )
}

export default EstadoSolicitud
