import Hero from '../components/home/Hero'



function Home() {
  return (
    <main>

      {/* Hero */}
        <Hero />


      {/* Sobre mí */}
      <section id="sobre-mi" className="container py-5">
        <h2>Entre pluma y código</h2>
        <p>Mi trabajo nace de la combinación entre diseño gráfico y programación. Integro lo visual y lo funcional para transformar ideas en soluciones digitales claras, funcionales y con identidad propia.</p>
      </section>

      {/* Servicios */}
      <section id="servicios" className="container py-5">
        <h2>Servicios Disponibles</h2>
        <p>Soluciones creativas y digitales para dar forma, identidad y presencia a tus ideas.</p>
      </section>

      {/* Testimonios*/}
      <section id="Testimonios" className="container py-5">
        <h2>¿Qué dicen mis clientes?</h2>
        <p>Experiencias de personas con las que he tenido la oportunidad de trabajar.</p>
      </section>

      {/* Contacto */}
      <section id="contacto" className="container py-5">
        <h2>Contáctame a través de estos medios</h2>
        <p>¿Tienes una idea o proyecto en mente? Cuéntame sobre él y conversemos para encontrar la mejor forma de hacerlo realidad.</p>
      </section>

    </main>
  )
}

export default Home
