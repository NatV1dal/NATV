
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ScrollToHash from './components/ScrollToHash'
import Home from './pages/Home'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Footer from './components/Footer'
import ServiciosCategoria from './pages/ServiciosCategoria'
import DetalleServicio from './pages/DetalleServicio'

import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/servicios/:categoria" element={<ServiciosCategoria />} />
        <Route path="/servicios/:categoria/:servicio" element={<DetalleServicio />}/>
        
      </Routes>
      <Footer />
    </>
  )
}

export default App
