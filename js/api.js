/**
 * Módulo de comunicação com a API
 * Gerencia todas as requisições HTTP para o backend
 */

class ApiService {
    constructor(config) {
        this.baseURL = config.baseURL;
        this.endpoints = config.endpoints;
        this.timeout = config.timeout || 10000;
        this.headers = config.headers || {};
    }

    /**
     * Faz uma requisição HTTP
     * @param {string} endpoint - Endpoint da API
     * @param {object} options - Opções da requisição (method, body, headers, etc)
     * @returns {Promise} - Promise com a resposta
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const method = options.method || 'GET';
        const headers = { ...this.headers, ...options.headers };
        const body = options.body ? JSON.stringify(options.body) : undefined;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                method,
                headers,
                body,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('API Request Error:', error);
            return { success: false, error: error.message };
        }
    }

    // ========== EVENTOS ==========
    
    async getEvents(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = queryParams ? `${this.endpoints.events}?${queryParams}` : this.endpoints.events;
        return this.request(endpoint);
    }

    async getEventById(id) {
        return this.request(this.endpoints.eventById(id));
    }

    async getUpcomingEvents(limit = 5) {
        return this.request(`${this.endpoints.upcomingEvents}?limit=${limit}`);
    }

    async getWeeklyEvents() {
        return this.request(this.endpoints.weeklyEvents);
    }

    async getMonthlyEvents() {
        return this.request(this.endpoints.monthlyEvents);
    }

    async getYearlyEvents() {
        return this.request(this.endpoints.yearlyEvents);
    }

    // ========== MINISTÉRIOS ==========
    
    async getMinistries() {
        return this.request(this.endpoints.ministries);
    }

    async getMinistryById(id) {
        return this.request(this.endpoints.ministryById(id));
    }

    // ========== LIDERANÇA ==========
    
    async getLeaders() {
        return this.request(this.endpoints.leaders);
    }

    async getLeaderById(id) {
        return this.request(this.endpoints.leaderById(id));
    }

    // ========== SERMÕES ==========
    
    async getSermons(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = queryParams ? `${this.endpoints.sermons}?${queryParams}` : this.endpoints.sermons;
        return this.request(endpoint);
    }

    async getSermonById(id) {
        return this.request(this.endpoints.sermonById(id));
    }

    // ========== NOTÍCIAS/BLOG ==========
    
    async getPosts(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = queryParams ? `${this.endpoints.posts}?${queryParams}` : this.endpoints.posts;
        return this.request(endpoint);
    }

    async getPostById(id) {
        return this.request(this.endpoints.postById(id));
    }

    // ========== GALERIA ==========
    
    async getGallery() {
        return this.request(this.endpoints.gallery);
    }

    async getPhotos() {
        return this.request(this.endpoints.photos);
    }

    async getVideos() {
        return this.request(this.endpoints.videos);
    }

    // ========== CONTATO ==========
    
    async sendContact(data) {
        return this.request(this.endpoints.contact, {
            method: 'POST',
            body: data
        });
    }

    async sendPrayerRequest(data) {
        return this.request(this.endpoints.prayerRequest, {
            method: 'POST',
            body: data
        });
    }

    // ========== TRANSMISSÃO AO VIVO ==========
    
    async getLiveStream() {
        return this.request(this.endpoints.liveStream);
    }

    // ========== INFORMAÇÕES DA IGREJA ==========
    
    async getChurchInfo() {
        return this.request(this.endpoints.churchInfo);
    }
}

// Inicializar o serviço de API
let apiService;

if (typeof window !== 'undefined' && window.API_CONFIG) {
    apiService = new ApiService(window.API_CONFIG);
    window.apiService = apiService;
}

// Exportar para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiService;
}



