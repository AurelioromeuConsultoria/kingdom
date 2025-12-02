import { useEffect } from 'react'
import './Toast.css'

function Toast({ message, type, onClose }) {
  useEffect(() => {
    if (message) {
      // Auto-fechar após 5 segundos
      const timer = setTimeout(() => {
        onClose()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [message, onClose])

  if (!message) return null

  return (
    <div className={`toast-notification ${type}`}>
      <div className="toast-icon">
        {type === 'success' ? (
          <i className="fa-solid fa-check-circle"></i>
        ) : (
          <i className="fa-solid fa-exclamation-circle"></i>
        )}
      </div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={onClose} aria-label="Fechar">
        <i className="fa-solid fa-times"></i>
      </button>
    </div>
  )
}

export default Toast




