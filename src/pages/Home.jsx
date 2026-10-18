import Hero from '../components/home/Hero'
import SobreMi from '../components/home/SobreMi'



function Home() {
  return (
    <main>

      {/* Hero */}
        <Hero />


      {/* Sobre mí */}
     <SobreMi />

      {/* Servicios */}
      <section id="servicios" className="container py-5">
        <h2>Servicios Disponibles</h2>
      </section>

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
