import axios from 'axios'
import API_CONFIG from './api.config'

/**
 * Serviço de API para comunicação com backend .NET
 */
class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: API_CONFIG.headers
    })

    // Interceptor para requisições
    this.api.interceptors.request.use(
      (config) => {
        // Adicionar token de autenticação se necessário
        // const token = localStorage.getItem('token')
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`
        // }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Interceptor para respostas
    this.api.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        // Tratamento global de erros
        if (error.response) {
          // Erro da API (4xx, 5xx)
          console.error('❌ Erro da API:', {
            status: error.response.status,
            statusText: error.response.statusText,
            url: error.config?.url,
            data: error.response.data
          })
        } else if (error.request) {
          // Erro de rede (API não respondeu)
          console.error('❌ Erro de Rede - API não está respondendo:', {
            url: error.config?.url,
            baseURL: error.config?.baseURL,
            message: 'Verifique se a API .NET está rodando e se a URL está correta no .env.local'
          })
        } else {
          // Outro erro
          console.error('❌ Erro:', error.message)
        }
        return Promise.reject(error)
      }
    )
  }

  // ========== EVENTOS ==========
  
  async getEvents(params = {}) {
    const response = await this.api.get('/Eventos', { params })
    return response.data
  }

  async getEventById(id) {
    const response = await this.api.get(`/Eventos/${id}`)
    return response.data
  }

  async getEventsByPeriod(startDate, endDate) {
    const response = await this.api.get('/Eventos/periodo', { 
      params: { 
        dataInicio: startDate,
        dataFim: endDate
      } 
    })
    return response.data
  }

  async getUpcomingEvents(limit = 5) {
    // Se a API tiver endpoint específico para próximos eventos
    // Caso contrário, buscar todos e filtrar no frontend
    const response = await this.api.get('/Eventos')
    const events = Array.isArray(response.data) ? response.data : []
    const now = new Date()
    const upcoming = events
      .filter(event => {
        const eventDate = new Date(event.dataInicio || event.date || event.data)
        return eventDate >= now
      })
      .sort((a, b) => {
        const dateA = new Date(a.dataInicio || a.date || a.data)
        const dateB = new Date(b.dataInicio || b.date || b.data)
        return dateA - dateB
      })
      .slice(0, limit)
    return upcoming
  }

  async getWeeklyEvents() {
    // Buscar eventos da semana atual
    const now = new Date()
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6))
    return this.getEventsByPeriod(
      startOfWeek.toISOString().split('T')[0],
      endOfWeek.toISOString().split('T')[0]
    )
  }

  async getMonthlyEvents() {
    // Buscar eventos do mês atual
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return this.getEventsByPeriod(
      startOfMonth.toISOString().split('T')[0],
      endOfMonth.toISOString().split('T')[0]
    )
  }

  async getYearlyEvents() {
    // Buscar eventos do ano atual
    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const endOfYear = new Date(now.getFullYear(), 11, 31)
    return this.getEventsByPeriod(
      startOfYear.toISOString().split('T')[0],
      endOfYear.toISOString().split('T')[0]
    )
  }

  // ========== MINISTÉRIOS (Equipes no backend) ==========
  
  async getMinistries() {
    const response = await this.api.get('/Equipes')
    const equipes = Array.isArray(response.data) ? response.data : []
    return equipes.map(e => ({
      id: e.id,
      name: e.nome,
      description: ''
    }))
  }

  async getMinistryById(id) {
    const response = await this.api.get(`/Equipes/${id}`)
    const e = response.data
    return { id: e.id, name: e.nome, description: '' }
  }

  // ========== VOLUNTÁRIOS ==========
  
  async getVoluntarios() {
    const response = await this.api.get('/Voluntarios')
    return response.data
  }

  async getVoluntarioById(id) {
    const response = await this.api.get(`/Voluntarios/${id}`)
    return response.data
  }

  // ========== LIDERANÇA ==========
  
  async getLeaders() {
    const response = await this.api.get('/leaders')
    return response.data
  }

  async getLeaderById(id) {
    const response = await this.api.get(`/leaders/${id}`)
    return response.data
  }

  // ========== SERMÕES ==========
  
  async getSermons(params = {}) {
    const response = await this.api.get('/sermons', { params })
    return response.data
  }

  async getSermonById(id) {
    const response = await this.api.get(`/sermons/${id}`)
    return response.data
  }

  // ========== NOTÍCIAS/BLOG ==========
  
  async getNoticias(params = {}) {
    const response = await this.api.get('/Noticias', { params })
    return response.data
  }

  async getNoticiaById(id) {
    const response = await this.api.get(`/Noticias/${id}`)
    return response.data
  }

  async getNoticiasByCategoria(categoriaId) {
    const response = await this.api.get(`/Noticias/categoria/${categoriaId}`)
    return response.data
  }

  // Métodos legados para compatibilidade (podem ser removidos depois)
  async getPosts(params = {}) {
    return this.getNoticias(params)
  }

  async getPostById(id) {
    return this.getNoticiaById(id)
  }

  // ========== GALERIA ==========
  
  async getGallery() {
    const response = await this.api.get('/gallery')
    return response.data
  }

  async getPhotos() {
    const response = await this.api.get('/gallery/photos')
    return response.data
  }

  async getVideos() {
    const response = await this.api.get('/gallery/videos')
    return response.data
  }

  // ========== GALERIAS DE FOTOS ==========
  
  /**
   * Lista todas as galerias ativas (publicadas)
   */
  async getGaleriasAtivas() {
    const response = await this.api.get('/galeriasFotos/ativas')
    return response.data
  }

  /**
   * Busca uma galeria específica por ID
   */
  async getGaleriaById(id) {
    const response = await this.api.get(`/galeriasFotos/${id}`)
    return response.data
  }

  /**
   * Busca galerias por evento
   */
  async getGaleriasByEvento(eventoId) {
    const response = await this.api.get(`/galeriasFotos/evento/${eventoId}`)
    return response.data
  }

  /**
   * Busca galerias por categoria
   */
  async getGaleriasByCategoria(categoriaMidiaId) {
    const response = await this.api.get(`/galeriasFotos/categoria/${categoriaMidiaId}`)
    return response.data
  }

  /**
   * Lista todas as fotos de uma galeria específica
   */
  async getFotosByGaleria(galeriaId) {
    const response = await this.api.get(`/galeriasFotos/${galeriaId}/fotos`)
    return response.data
  }

  /**
   * Lista todas as categorias de mídia
   */
  async getCategoriasMidias() {
    const response = await this.api.get('/categoriasMidias')
    return response.data
  }

  /**
   * Retorna a URL base da API (sem /api) para montar URLs de imagens
   */
  getApiBaseUrl() {
    return (API_CONFIG.baseURL || '').replace(/\/api\/?$/, '') || 'http://localhost:5000'
  }

  /**
   * Retorna a URL base dos uploads (produção), para imagens centralizadas mesmo rodando local
   */
  getUploadsBaseUrl() {
    return (API_CONFIG.uploadsBaseURL || '').replace(/\/+$/, '') || 'https://api.kingdombr.com.br'
  }

  /**
   * Constrói URL completa para qualquer imagem do backend (uploads, destaques, etc.)
   * Usa sempre a base de uploads (produção) para centralizar imagens
   */
  getImageUrl(imagem) {
    if (!imagem) return null
    if (imagem.startsWith('http://') || imagem.startsWith('https://')) return imagem
    const base = this.getUploadsBaseUrl()
    const path = imagem.startsWith('/') ? imagem : `/${imagem}`
    return `${base}${path}`
  }

  /**
   * Constrói URL completa para thumbnail de uma foto
   */
  getThumbnailUrl(caminhoDiretorio, nomeArquivo) {
    const baseURL = this.getUploadsBaseUrl()
    const dir = (caminhoDiretorio || '').replace(/^\/+/, '')
    return `${baseURL}/${dir}/thumbnail/${nomeArquivo}`
  }

  /**
   * Constrói URL completa para foto original
   */
  getOriginalUrl(caminhoDiretorio, nomeArquivo) {
    const baseURL = this.getUploadsBaseUrl()
    const dir = (caminhoDiretorio || '').replace(/^\/+/, '')
    return `${baseURL}/${dir}/original/${nomeArquivo}`
  }

  /**
   * Constrói URL completa para imagem de destaque
   */
  getDestaqueUrl(imagemDestaque) {
    return this.getImageUrl(imagemDestaque)
  }

  // ========== CONTATO ==========
  
  async sendContact(data) {
    const response = await this.api.post('/Contatos', data)
    return response.data
  }

  async sendPrayerRequest(data) {
    const response = await this.api.post('/contact/prayer', data)
    return response.data
  }

  // ========== CADASTRO DE MEMBRO ==========

  async cadastrarMembro(data) {
    const response = await this.api.post('/Membros/cadastro', data)
    return response.data
  }

  // ========== TRANSMISSÃO AO VIVO ==========
  
  async getLiveStream() {
    const response = await this.api.get('/livestream')
    return response.data
  }

  // ========== INFORMAÇÕES DA IGREJA ==========
  // Configuração do portal + defaults (backend não tem /church/info)
  
  async getChurchInfo() {
    try {
      const config = await this.getConfiguracaoPortal()
      return {
        ...config,
        contact: {
          email: config.contact?.email || 'contato@kingdombr.com.br',
          phone: config.contact?.phone || '11 94793-4943'
        },
        description: config.description || 'Somos uma comunidade cristocêntrica e orgânica, formada por pessoas que desejam manifestar Cristo na vida comum.',
        address: config.address || 'Rua Exemplo, 123 - São Paulo, SP',
        socialMedia: config.socialMedia || {}
      }
    } catch {
      return {
        contact: { email: 'contato@kingdombr.com.br', phone: '11 94793-4943' },
        description: 'Somos uma comunidade cristocêntrica e orgânica, formada por pessoas que desejam manifestar Cristo na vida comum.',
        address: 'Rua Exemplo, 123 - São Paulo, SP',
        socialMedia: {}
      }
    }
  }

  // ========== DESTAQUES DO SITE ==========
  
  async getDestaquesSite() {
    try {
      // Adicionar timestamp para evitar cache
      console.log('🔍 Fazendo requisição para /DestaquesSite')
      const response = await this.api.get('/DestaquesSite', {
        params: {
          _t: Date.now() // Timestamp para evitar cache
        }
      })
      console.log('✅ Resposta recebida de /DestaquesSite:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao buscar destaques:', error)
      console.error('Detalhes do erro:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      })
      throw error // Re-throw para que o erro seja tratado no componente
    }
  }

  // ========== CONFIGURAÇÃO DO PORTAL ==========
  
  async getConfiguracaoPortal() {
    try {
      console.log('🔍 Fazendo requisição para /ConfiguracaoPortal')
      const response = await this.api.get('/ConfiguracaoPortal', {
        params: {
          _t: Date.now() // Timestamp para evitar cache
        }
      })
      console.log('✅ Resposta recebida de /ConfiguracaoPortal:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao buscar configuração do portal:', error)
      // Retornar configuração padrão em caso de erro
      return { tempoTransicaoCarrossel: 5 }
    }
  }
}

// Exportar instância única (Singleton)
export default new ApiService()

