import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './index.css'
import './styles/shared-pages.css'

// Inicializar plugins do template quando necessário
import { initializeTemplatePlugins } from './utils/templatePlugins'
// Traduzir mensagens de validação HTML5 para português
import { setupValidationTranslations } from './utils/validationTranslations'

// Inicializar plugins após o DOM estar pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeTemplatePlugins()
    setupValidationTranslations()
  })
} else {
  initializeTemplatePlugins()
  setupValidationTranslations()
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)



