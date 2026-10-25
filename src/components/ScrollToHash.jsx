import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {

    // Si la URL tiene una sección
    if (hash) {
      const id = decodeURIComponent(hash.slice(1))
      const elemento = document.getElementById(id)

      if (elemento) {
        elemento.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }

      return
    }

    // comienza desde la parte superior de la página si no hay hash
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    })

  }, [pathname, hash])

  return null
}

export default ScrollToHash