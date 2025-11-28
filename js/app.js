/**
 * Aplicação principal
 * Gerencia a lógica da aplicação e integração com a API
 */

class ChurchApp {
    constructor() {
        this.api = window.apiService;
        this.init();
    }

    init() {
        // Aguardar o DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onReady());
        } else {
            this.onReady();
        }
    }

    onReady() {
        console.log('Church App initialized');
        
        // Carregar dados iniciais
        this.loadInitialData();
        
        // Configurar event listeners
        this.setupEventListeners();
    }

    /**
     * Carrega dados iniciais da API
     */
    async loadInitialData() {
        if (!this.api) {
            console.warn('API Service not available');
            return;
        }

        try {
            // Carregar informações da igreja
            await this.loadChurchInfo();
            
            // Carregar eventos próximos
            await this.loadUpcomingEvents();
            
            // Carregar ministérios
            await this.loadMinistries();
            
            // Carregar últimas notícias
            await this.loadLatestPosts();
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    }

    /**
     * Carrega informações da igreja
     */
    async loadChurchInfo() {
        const response = await this.api.getChurchInfo();
        if (response.success && response.data) {
            this.updateChurchInfo(response.data);
        }
    }

    /**
     * Atualiza informações da igreja no DOM
     */
    updateChurchInfo(data) {
        // Atualizar nome da igreja
        if (data.name) {
            document.querySelectorAll('.church-name').forEach(el => {
                el.textContent = data.name;
            });
        }

        // Atualizar informações de contato
        if (data.contact) {
            if (data.contact.email) {
                document.querySelectorAll('.church-email').forEach(el => {
                    el.textContent = data.contact.email;
                    el.href = `mailto:${data.contact.email}`;
                });
            }
            if (data.contact.phone) {
                document.querySelectorAll('.church-phone').forEach(el => {
                    el.textContent = data.contact.phone;
                    el.href = `tel:${data.contact.phone}`;
                });
            }
            if (data.contact.address) {
                document.querySelectorAll('.church-address').forEach(el => {
                    el.textContent = data.contact.address;
                });
            }
        }

        // Atualizar redes sociais
        if (data.socialMedia) {
            this.updateSocialMedia(data.socialMedia);
        }
    }

    /**
     * Atualiza links de redes sociais
     */
    updateSocialMedia(socialMedia) {
        const socialMap = {
            facebook: '.social-facebook',
            twitter: '.social-twitter',
            instagram: '.social-instagram',
            linkedin: '.social-linkedin',
            youtube: '.social-youtube'
        };

        Object.keys(socialMap).forEach(platform => {
            if (socialMedia[platform]) {
                document.querySelectorAll(socialMap[platform]).forEach(el => {
                    el.href = socialMedia[platform];
                });
            }
        });
    }

    /**
     * Carrega eventos próximos
     */
    async loadUpcomingEvents() {
        const response = await this.api.getUpcomingEvents(3);
        if (response.success && response.data) {
            this.renderUpcomingEvents(response.data);
        }
    }

    /**
     * Renderiza eventos próximos
     */
    renderUpcomingEvents(events) {
        const container = document.querySelector('.upcoming-events-container');
        if (!container || !events || events.length === 0) return;

        container.innerHTML = events.map(event => `
            <div class="event-card">
                <div class="event-image">
                    ${event.image ? `<img src="${event.image}" alt="${event.title}">` : ''}
                </div>
                <div class="event-content">
                    <h3>${event.title}</h3>
                    <p>${event.description || ''}</p>
                    <div class="event-meta">
                        <span><i class="fa-solid fa-calendar"></i> ${this.formatDate(event.date)}</span>
                        ${event.location ? `<span><i class="fa-solid fa-location-dot"></i> ${event.location}</span>` : ''}
                    </div>
                    <a href="event-details.html?id=${event.id}" class="read-more-btn">
                        Read More <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `).join('');
    }

    /**
     * Carrega ministérios
     */
    async loadMinistries() {
        const response = await this.api.getMinistries();
        if (response.success && response.data) {
            this.renderMinistries(response.data);
        }
    }

    /**
     * Renderiza ministérios
     */
    renderMinistries(ministries) {
        const container = document.querySelector('.ministries-container');
        if (!container || !ministries || ministries.length === 0) return;

        container.innerHTML = ministries.map(ministry => `
            <div class="ministry-card">
                <div class="ministry-image">
                    ${ministry.image ? `<img src="${ministry.image}" alt="${ministry.name}">` : ''}
                </div>
                <div class="ministry-content">
                    <h4><a href="ministry-details.html?id=${ministry.id}">${ministry.name}</a></h4>
                    <p>${ministry.description || ''}</p>
                </div>
            </div>
        `).join('');
    }

    /**
     * Carrega últimas notícias
     */
    async loadLatestPosts() {
        const response = await this.api.getPosts({ limit: 3 });
        if (response.success && response.data) {
            this.renderLatestPosts(response.data);
        }
    }

    /**
     * Renderiza últimas notícias
     */
    renderLatestPosts(posts) {
        const container = document.querySelector('.latest-posts-container');
        if (!container || !posts || posts.length === 0) return;

        container.innerHTML = posts.map(post => `
            <div class="post-card">
                <div class="post-image">
                    ${post.image ? `<img src="${post.image}" alt="${post.title}">` : ''}
                </div>
                <div class="post-content">
                    <ul class="post-meta">
                        <li><i class="fa-solid fa-user"></i> ${post.author || 'Admin'}</li>
                        <li><i class="fa-solid fa-calendar-days"></i> ${this.formatDate(post.date)}</li>
                    </ul>
                    <h4><a href="post-details.html?id=${post.id}">${post.title}</a></h4>
                    <a href="post-details.html?id=${post.id}" class="read-more-btn">
                        Read More <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `).join('');
    }

    /**
     * Configura event listeners
     */
    setupEventListeners() {
        // Formulário de contato
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
        }

        // Formulário de pedido de oração
        const prayerForm = document.getElementById('prayer-form');
        if (prayerForm) {
            prayerForm.addEventListener('submit', (e) => this.handlePrayerSubmit(e));
        }
    }

    /**
     * Manipula envio do formulário de contato
     */
    async handleContactSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        const response = await this.api.sendContact(data);
        
        submitButton.disabled = false;
        submitButton.textContent = originalText;

        if (response.success) {
            this.showMessage('Mensagem enviada com sucesso!', 'success');
            form.reset();
        } else {
            this.showMessage('Erro ao enviar mensagem. Tente novamente.', 'error');
        }
    }

    /**
     * Manipula envio do formulário de pedido de oração
     */
    async handlePrayerSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        const response = await this.api.sendPrayerRequest(data);
        
        submitButton.disabled = false;
        submitButton.textContent = originalText;

        if (response.success) {
            this.showMessage('Pedido de oração enviado com sucesso!', 'success');
            form.reset();
        } else {
            this.showMessage('Erro ao enviar pedido. Tente novamente.', 'error');
        }
    }

    /**
     * Exibe mensagem para o usuário
     */
    showMessage(message, type = 'info') {
        // Criar elemento de mensagem
        const messageEl = document.createElement('div');
        messageEl.className = `alert alert-${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            border-radius: 4px;
            z-index: 10000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;

        document.body.appendChild(messageEl);

        // Remover após 5 segundos
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }

    /**
     * Formata data
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Inicializar aplicação quando a API estiver disponível
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        if (window.apiService) {
            window.churchApp = new ChurchApp();
        } else {
            console.warn('API Service not loaded. Make sure api.config.js and api.js are loaded first.');
        }
    });
}



