
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ScrollToHash from './components/ScrollToHash'
import Home from './pages/Home'
import Login from './pages/Login'
import Registro from './pages/Registro'
import RecuperarContrasena from './pages/RecuperarContrasena'
import Footer from './components/Footer'
import ServiciosCategoria from './pages/ServiciosCategoria'
import DetalleServicio from './pages/DetalleServicio'
import PerfilCliente from './pages/PerfilCliente'
import EditarDatos from './pages/EditarDatos'
import PerfilAdmin from './pages/PerfilAdmin'
import EstadoSolicitud from './pages/EstadoSolicitud'
import ListadoAdmin from './pages/ListadoAdmin'
import CotizarSolicitud from './pages/CotizarSolicitud'
import { SolicitudesProvider } from './context/SolicitudesContext'
import { ServiciosProvider } from './context/ServiciosContext'
import { solicitudesIniciales } from './pages/PerfilAdmin'
import AgregarServicio from './pages/AgregarServicio'

import './App.css'

function App() {
  return (
    <SolicitudesProvider datosIniciales={solicitudesIniciales}>
      <ServiciosProvider>
      <Navbar />
      <ScrollToHash />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />

        <Route path="/admin" element={<PerfilAdmin />} />
        <Route path="/admin/agregar-servicio" element={<AgregarServicio />} />
        <Route path="/admin/cotizaciones/:id"element={<CotizarSolicitud />} />  
        <Route path="/admin/:seccion" element={<ListadoAdmin />} />

        <Route path="/perfil" element={<PerfilCliente />} />
        <Route path="/perfil/editar" element={<EditarDatos />} />
        <Route path="/perfil/solicitudes/:id" element={<EstadoSolicitud />} />

        <Route path="/servicios/:categoria" element={<ServiciosCategoria />} />
        <Route path="/servicios/:categoria/:servicio" element={<DetalleServicio />}/>
        
       
        
      </Routes>
      <Footer />
      </ServiciosProvider>
      </SolicitudesProvider>
  )
}

export default App
