/**
 * Configuração da API .NET
 *
 * A URL da API é configurada via VITE_API_BASE_URL:
 * - .env.development → localhost (npm run dev)
 * - .env.production  → api.kingdombr.com.br (build/deploy)
 */

const PRODUCTION_HOST = 'https://api.kingdombr.com.br'
const productionApiBase = `${PRODUCTION_HOST}/api`

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7000/api'
const isApiLocal = /localhost|127\.0\.0\.1/.test(baseURL)

const API_CONFIG = {
  baseURL,

  // URL base para imagens/uploads (em dev com API local = sempre produção)
  uploadsBaseURL: (import.meta.env.DEV && isApiLocal)
    ? PRODUCTION_HOST
    : (import.meta.env.VITE_UPLOADS_BASE_URL || PRODUCTION_HOST),

  // Em dev com API local: buscar galeria e lista de fotos na API de produção (mesmo storage)
  useProductionApiForGallery: import.meta.env.DEV && isApiLocal,
  productionApiBaseURL: productionApiBase,

  timeout: 10000,

  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

if (import.meta.env.DEV) {
  console.log('🔌 API Configurada:', API_CONFIG.baseURL)
  if (API_CONFIG.useProductionApiForGallery) {
    console.log('🔌 Portal: galeria e fotos usam API de produção (storage centralizado)')
  }
}

export default API_CONFIG
