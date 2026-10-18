
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) return

    const id = decodeURIComponent(hash.slice(1))
    const elemento = document.getElementById(id)

    if (elemento) {
      elemento.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, [pathname, hash])

  return null
}

export default ScrollToHash
