import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import './styles/shared-pages.css'

// Inicializar plugins do template quando necessário
import { initializeTemplatePlugins } from './utils/templatePlugins'

// Inicializar plugins após o DOM estar pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeTemplatePlugins)
} else {
  initializeTemplatePlugins()
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)



