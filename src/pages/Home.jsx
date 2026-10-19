import Hero from '../components/home/Hero'
import SobreMi from '../components/home/SobreMi'
import Servicios from '../components/home/Servicios'
import Testimonios from '../components/home/Testimonios'



function Home() {
  return (
    <main>
      {/* secciones */}
        <Hero />
        <SobreMi />
        <Servicios />
        <Testimonios />

     

      {/* Contacto */}
      <section id="contacto" className="container py-5">
        <h2>Contáctame a través de estos medios</h2>
      </section>

    </main>
  )
}

export default Home
