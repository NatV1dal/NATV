
import './CardTestimonio.css'

function CardTestimonio({
  comentario,
  nombre,
  proyecto,
  foto,
  color
}) {
  return (
    <article className="card-testimonio">

      <div className="card-testimonio-avatar">
        {foto ? (
          <img src={foto} alt="" />
        ) : (
          <span aria-hidden="true">👤</span>
        )}
      </div>

      <div className="card-testimonio-contenido">

        <span
          className={`card-testimonio-comillas ${color}`}
          aria-hidden="true"
        >
          “
        </span>

        <p className="card-testimonio-comentario">
          {comentario}
        </p>

        <div className="card-testimonio-cliente">
          <strong>{nombre}</strong>
          <span>{proyecto}</span>
        </div>

      </div>

    </article>
  )
}

export default CardTestimonio
