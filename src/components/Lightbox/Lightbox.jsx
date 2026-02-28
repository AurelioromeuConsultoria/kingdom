import { useEffect } from 'react'
import apiService from '../../services/api.service'
import './Lightbox.css'

function Lightbox({
  foto,
  galeria,
  totalFotos,
  fotoAtual,
  onClose,
  onAnterior,
  onProxima
}) {
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        onAnterior()
      } else if (e.key === 'ArrowRight') {
        onProxima()
      }
    }

    // Prevenir scroll do body quando lightbox está aberto
    document.body.style.overflow = 'hidden'

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      document.body.style.overflow = 'unset'
    }
  }, [onClose, onAnterior, onProxima])

  const imageBaseURL = apiService.getApiBaseUrl()
  const originalUrl = `${imageBaseURL}/${galeria.caminhoDiretorio}/original/${foto.nomeArquivo}`

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} aria-label="Fechar">
          <i className="fa-solid fa-times"></i>
        </button>
        
        <button 
          className="lightbox-nav lightbox-prev" 
          onClick={onAnterior}
          aria-label="Foto anterior"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        
        <div className="lightbox-image-container">
          <img 
            src={originalUrl}
            alt={foto.nomeArquivo}
            className="lightbox-image"
            loading="eager"
          />
        </div>
        
        <button 
          className="lightbox-nav lightbox-next" 
          onClick={onProxima}
          aria-label="Próxima foto"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
        
        <div className="lightbox-counter">
          {fotoAtual + 1} de {totalFotos}
        </div>
      </div>
    </div>
  )
}

export default Lightbox

