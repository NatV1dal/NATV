
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
import { AuthProvider } from './context/AuthContext'
import RutaProtegida from './components/RutaProtegida'
import Pagina404 from './pages/Pagina404'

import './App.css'

function App() {
  return (
    <AuthProvider>
      <SolicitudesProvider datosIniciales={solicitudesIniciales}>
        <ServiciosProvider>
          <Navbar />
          <ScrollToHash />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
            <Route path="*" element={<Pagina404 />} />

            <Route path="/admin" element={<RutaProtegida rolPermitido="administrador"><PerfilAdmin /></RutaProtegida>} />
            <Route path="/admin/agregar-servicio" element={<RutaProtegida rolPermitido="administrador"><AgregarServicio /></RutaProtegida>} />
            <Route path="/admin/cotizaciones/:id" element={<RutaProtegida rolPermitido="administrador"><CotizarSolicitud /></RutaProtegida>} />
            <Route path="/admin/:seccion" element={<RutaProtegida rolPermitido="administrador"><ListadoAdmin /></RutaProtegida>} />

            <Route path="/perfil" element={<RutaProtegida rolPermitido="cliente"><PerfilCliente /></RutaProtegida>} />
            <Route path="/perfil/editar" element={<RutaProtegida><EditarDatos /></RutaProtegida>} />
            <Route path="/perfil/solicitudes/:id" element={<RutaProtegida rolPermitido="cliente"><EstadoSolicitud /></RutaProtegida>} />

            <Route path="/servicios/:categoria" element={<ServiciosCategoria />} />
            <Route path="/servicios/:categoria/:servicio" element={<DetalleServicio />} />
          </Routes>

          <Footer />
        </ServiciosProvider>
      </SolicitudesProvider>
    </AuthProvider>
  )
}

export default App
