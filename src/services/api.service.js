import axios from 'axios'
import API_CONFIG from './api.config'

const ACCESS_TOKEN_KEY = 'portal.member.accessToken'
const REFRESH_TOKEN_KEY = 'portal.member.refreshToken'
const AUTH_EXPIRED_EVENT = 'portal.member.authExpired'

/**
 * Serviço de API para comunicação com backend .NET
 */
class ApiService {
  constructor() {
    this.refreshPromise = null
    this.api = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: API_CONFIG.headers
    })

    // Interceptor para requisições
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getStoredAccessToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
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
        const originalRequest = error.config || {}

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !String(originalRequest.url || '').includes('/Auth/login') &&
          !String(originalRequest.url || '').includes('/Auth/refresh')
        ) {
          const refreshToken = this.getStoredRefreshToken()

          if (!refreshToken) {
            this.clearAuthSession()
            this.notifyAuthExpired()
            return Promise.reject(error)
          }

          originalRequest._retry = true

          if (!this.refreshPromise) {
            this.refreshPromise = this.refreshToken(refreshToken)
              .then((result) => {
                this.storeAuthSession(result)
                return result
              })
              .catch((refreshError) => {
                this.clearAuthSession()
                this.notifyAuthExpired()
                throw refreshError
              })
              .finally(() => {
                this.refreshPromise = null
              })
          }

          return this.refreshPromise.then((result) => {
            if (result?.token) {
              originalRequest.headers = originalRequest.headers || {}
              originalRequest.headers.Authorization = `Bearer ${result.token}`
            }
            return this.api(originalRequest)
          })
        }

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

  getStoredAccessToken() {
    if (typeof window === 'undefined') return null
    return window.localStorage.getItem(ACCESS_TOKEN_KEY)
  }

  getStoredRefreshToken() {
    if (typeof window === 'undefined') return null
    return window.localStorage.getItem(REFRESH_TOKEN_KEY)
  }

  storeAuthSession({ token, refreshToken }) {
    if (typeof window === 'undefined') return
    if (token) {
      window.localStorage.setItem(ACCESS_TOKEN_KEY, token)
    }
    if (refreshToken) {
      window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    }
  }

  clearAuthSession() {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(ACCESS_TOKEN_KEY)
    window.localStorage.removeItem(REFRESH_TOKEN_KEY)
  }

  notifyAuthExpired() {
    if (typeof window === 'undefined') return
    window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT))
  }

  // ========== AUTENTICAÇÃO / ÁREA DO MEMBRO ==========

  async login(payload) {
    const response = await this.api.post('/Auth/login', payload)
    return response.data
  }

  async refreshToken(refreshToken) {
    const response = await this.api.post('/Auth/refresh', { refreshToken })
    return response.data
  }

  async getMe() {
    const response = await this.api.get('/Auth/me')
    return response.data
  }

  async getMinhaPessoa() {
    const response = await this.api.get('/Pessoas/me')
    return response.data
  }

  async atualizarMinhaPessoa(payload) {
    const response = await this.api.put('/Pessoas/me', payload)
    return response.data
  }

  async alterarSenha(payload) {
    const response = await this.api.put('/Auth/alterar-senha', payload)
    return response.data
  }

  async getPessoa360(id) {
    const response = await this.api.get(`/Pessoas/${id}/360`)
    return response.data
  }

  async getMinhasEscalas() {
    const response = await this.api.get('/Escalas/minhas')
    return response.data
  }

  async confirmarEscalaItem(escalaId, escalaItemId) {
    const response = await this.api.post(`/Escalas/${escalaId}/itens/${escalaItemId}/confirmar`)
    return response.data
  }

  async recusarEscalaItem(escalaId, escalaItemId, motivoRecusa) {
    const response = await this.api.post(`/Escalas/${escalaId}/itens/${escalaItemId}/recusar`, {
      motivoRecusa
    })
    return response.data
  }

  async getMinhasSolicitacoesTrocaEscala() {
    const response = await this.api.get('/SolicitacoesTrocasEscalas/minhas')
    return response.data
  }

  async criarSolicitacaoTrocaEscala(escalaId, escalaItemId, payload) {
    const response = await this.api.post(`/SolicitacoesTrocasEscalas/escala/${escalaId}/item/${escalaItemId}`, payload)
    return response.data
  }

  async getMinhasNotificacoes(params = {}) {
    const response = await this.api.get('/Notificacoes', { params })
    return response.data
  }

  async getCountNotificacoesNaoLidas() {
    const response = await this.api.get('/Notificacoes/nao-lidas/count')
    return response.data
  }

  async marcarNotificacaoComoLida(id) {
    const response = await this.api.post(`/Notificacoes/${id}/marcar-lida`)
    return response.data
  }

  async marcarTodasNotificacoesComoLidas() {
    const response = await this.api.post('/Notificacoes/marcar-todas-lidas')
    return response.data
  }

  async getPreferenciasComunicacao(pessoaId) {
    const response = await this.api.get(`/ComunicacaoPreferencias/pessoa/${pessoaId}`)
    return response.data
  }

  async atualizarPreferenciaComunicacao(pessoaId, canal, payload) {
    const response = await this.api.put(`/ComunicacaoPreferencias/pessoa/${pessoaId}/canal/${canal}`, payload)
    return response.data
  }

  async getMinhasCriancasKids() {
    const response = await this.api.get('/Kids/me/criancas')
    return response.data
  }

  async getMinhaCriancaKids(criancaPessoaId) {
    const response = await this.api.get(`/Kids/me/criancas/${criancaPessoaId}`)
    return response.data
  }

  async getMeusCheckinsKids() {
    const response = await this.api.get('/Kids/me/checkins')
    return response.data
  }

  async getMeusAvisosKids(params = {}) {
    const response = await this.api.get('/Kids/me/avisos', { params })
    return response.data
  }

  async marcarAvisoKidsComoLido(id) {
    const response = await this.api.patch(`/Kids/me/avisos/${id}/lido`)
    return response.data
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

  /**
   * Cria uma inscrição em um evento (portal público).
   * Payload: { eventoId, nome, whatsApp, email?, quantidadeAcompanhantes?, observacoes? }
   */
  async createInscricaoEvento(payload) {
    const response = await this.api.post('/InscricoesEventos', payload)
    return response.data
  }

  async getMinhasInscricoesEventos() {
    const response = await this.api.get('/InscricoesEventos/minhas')
    return response.data
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
   * Busca uma galeria específica por ID.
   * Em dev com API local, usa API de produção para obter dados e lista alinhados ao storage.
   */
  async getGaleriaById(id) {
    const url = API_CONFIG.useProductionApiForGallery
      ? `${API_CONFIG.productionApiBaseURL}/galeriasFotos/${id}`
      : `/galeriasFotos/${id}`
    const response = await this.api.get(url)
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
   * Lista todas as fotos de uma galeria específica.
   * Em dev com API local, usa API de produção para obter a lista (storage em produção).
   */
  async getFotosByGaleria(galeriaId) {
    const url = API_CONFIG.useProductionApiForGallery
      ? `${API_CONFIG.productionApiBaseURL}/galeriasFotos/${galeriaId}/fotos`
      : `/galeriasFotos/${galeriaId}/fotos`
    const response = await this.api.get(url)
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
    return (API_CONFIG.baseURL || '').replace(/\/api\/?$/, '') || 'http://localhost:7000'
  }

  /**
   * Retorna a URL base dos uploads (produção), para imagens centralizadas mesmo rodando local
   */
  getUploadsBaseUrl() {
    return (API_CONFIG.uploadsBaseURL || '').replace(/\/+$/, '') || 'https://api.verboplus.com.br'
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

  // ========== GENEROSIDADE / DOAÇÕES ==========

  async getFinalidadesDoacao() {
    const response = await this.api.get('/Doacoes/finalidades/publicas')
    return response.data
  }

  async criarDoacao(data) {
    const response = await this.api.post('/Doacoes', data)
    return response.data
  }

  async getStatusDoacao(token) {
    const response = await this.api.get(`/Doacoes/status/${token}`)
    return response.data
  }

  async getReciboDoacao(token) {
    const response = await this.api.get(`/Doacoes/recibo/${token}`)
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
