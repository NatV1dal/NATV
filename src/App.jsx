
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ScrollToHash from './components/ScrollToHash'
import Home from './pages/Home'
import Login from './pages/Login'
import Footer from './components/Footer'
import ServiciosCategoria from './pages/ServiciosCategoria'

import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/servicios/:categoria" element={<ServiciosCategoria />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
