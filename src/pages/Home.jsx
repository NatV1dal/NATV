import Hero from '../components/home/Hero'
import SobreMi from '../components/home/SobreMi'
import Servicios from '../components/home/Servicios'
import Testimonios from '../components/home/Testimonios'
import Contacto from '../components/home/Contacto'



function Home() {
  return (
    <main>
      {/* secciones */}
        <Hero />
        <SobreMi />
        <Servicios />
        <Testimonios />
        <Contacto />


    </main>
  )
}

export default Home
