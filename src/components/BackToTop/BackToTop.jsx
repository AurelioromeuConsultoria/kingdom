import { useEffect, useState } from 'react'
import './BackToTop.css'

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 600) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div className={`back-to-top ${isVisible ? 'visible' : ''}`}>
      <a href="#" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
        <i className="fas fa-arrow-up"></i>
      </a>
    </div>
  )
}

export default BackToTop



