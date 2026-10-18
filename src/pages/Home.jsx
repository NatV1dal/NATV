import Hero from '../components/home/Hero'
import SobreMi from '../components/home/SobreMi'
import Servicios from '../components/home/Servicios'



function Home() {
  return (
    <main>
      {/* secciones */}
        <Hero />
        <SobreMi />
        <Servicios />

      {/* Testimonios*/}
      <section id="Testimonios" className="container py-5">
        <h2>¿Qué dicen mis clientes?</h2>
      </section>

      {/* Contacto */}
      <section id="contacto" className="container py-5">
        <h2>Contáctame a través de estos medios</h2>
      </section>

    </main>
  )
}

export default Home
