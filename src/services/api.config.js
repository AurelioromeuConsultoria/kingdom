/**
 * Configuração da API .NET
 * 
 * A URL da API é configurada via VITE_API_BASE_URL:
 * - .env.development → localhost (npm run dev)
 * - .env.production  → api.kingdombr.com.br (build/deploy)
 */

const API_CONFIG = {
  // URL base da API .NET
  // Lê de VITE_API_BASE_URL no .env.local ou usa padrão
  // Exemplo: 'https://api.kingdom.com/api' ou 'http://localhost:5000/api'
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  
  // Timeout padrão para requisições (em ms)
  timeout: 10000,
  
  // Headers padrão
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

// Log da URL configurada (apenas em desenvolvimento)
if (import.meta.env.DEV) {
  console.log('🔌 API Configurada:', API_CONFIG.baseURL)
}

export default API_CONFIG

