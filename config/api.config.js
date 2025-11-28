/**
 * Configuração da API
 * Configure aqui a URL base da sua API
 */

const API_CONFIG = {
    // URL base da API
    baseURL: process.env.API_BASE_URL || 'http://localhost:3000/api',
    
    // Endpoints da API
    endpoints: {
        // Eventos
        events: '/events',
        eventById: (id) => `/events/${id}`,
        upcomingEvents: '/events/upcoming',
        weeklyEvents: '/events/weekly',
        monthlyEvents: '/events/monthly',
        yearlyEvents: '/events/yearly',
        
        // Ministérios
        ministries: '/ministries',
        ministryById: (id) => `/ministries/${id}`,
        
        // Liderança
        leaders: '/leaders',
        leaderById: (id) => `/leaders/${id}`,
        
        // Sermões
        sermons: '/sermons',
        sermonById: (id) => `/sermons/${id}`,
        
        // Notícias/Blog
        posts: '/posts',
        postById: (id) => `/posts/${id}`,
        
        // Galeria
        gallery: '/gallery',
        photos: '/gallery/photos',
        videos: '/gallery/videos',
        
        // Contato
        contact: '/contact',
        prayerRequest: '/contact/prayer',
        
        // Transmissão ao vivo
        liveStream: '/livestream',
        
        // Configurações da igreja
        churchInfo: '/church/info',
    },
    
    // Timeout padrão para requisições (em ms)
    timeout: 10000,
    
    // Headers padrão
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.API_CONFIG = API_CONFIG;
}

// Para Node.js/CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}



