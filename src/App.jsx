
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ScrollToHash from './components/ScrollToHash'
import Home from './pages/Home'
import Login from './pages/Login'

import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App
