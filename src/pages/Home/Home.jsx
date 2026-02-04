import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import apiService from '../../services/api.service'
import Toast from '../../components/Toast/Toast'
import './Home.css'

function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [ministries, setMinistries] = useState([])
  const [latestPosts, setLatestPosts] = useState([])
  const [destaques, setDestaques] = useState([])
  const [destaquesLoaded, setDestaquesLoaded] = useState(false) // Flag para saber se já tentou carregar
  const [tempoTransicaoCarrossel, setTempoTransicaoCarrossel] = useState(5) // Tempo de transição em segundos
  const [loading, setLoading] = useState(true)
  const [prayerFormData, setPrayerFormData] = useState({
    nome: '',
    whatsApp: '',
    email: '',
    membro: '',
    mensagem: ''
  })
  const [prayerMessage, setPrayerMessage] = useState({ type: '', text: '' })
  const [prayerLoading, setPrayerLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  // Recarregar dados quando a página ganhar foco (para pegar novos destaques)
  useEffect(() => {
    const handleFocus = () => {
      loadData()
    }
    
    window.addEventListener('focus', handleFocus)
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  // Reinicializar o banner slider quando o componente montar ou quando destaques ou tempoTransicaoCarrossel mudarem
  useEffect(() => {
    // Aguardar um pouco para garantir que o DOM foi atualizado com os novos destaques
    const timeoutId = setTimeout(() => {
      // Se não houver destaques, não inicializar o slider
      if (!destaques || destaques.length === 0) {
        console.log('⚠️ Nenhum destaque disponível para o slider. destaques:', destaques, 'length:', destaques?.length)
        return
      }
      
      console.log('✅ Inicializando slider com', destaques.length, 'destaques')

      console.log('Inicializando slider com', destaques.length, 'destaques. IDs:', destaques.map(d => d.id))

      let retryCount = 0
      const maxRetries = 50 // Máximo de tentativas (5 segundos)

      const initializeBannerSlider = () => {
        // Aguardar jQuery e Slick estarem disponíveis
        if (typeof window.jQuery === 'undefined' || typeof window.jQuery.fn.slick === 'undefined') {
          retryCount++
          if (retryCount < maxRetries) {
            // Tentar novamente após um breve delay
            setTimeout(initializeBannerSlider, 100)
            return
          } else {
            console.warn('jQuery ou Slick não disponíveis após múltiplas tentativas')
            return
          }
        }

        const $ = window.jQuery
        const slider = $('.banner-slider-active')

        if (slider.length === 0) {
          console.warn('Slider não encontrado no DOM')
          return
        }

        // Remover event listeners anteriores
        slider.off('init beforeChange')

        // Se o slider já foi inicializado, destruir primeiro
        if (slider.hasClass('slick-initialized')) {
          try {
            slider.slick('unslick')
          } catch (e) {
            console.warn('Erro ao destruir slider:', e)
          }
        }

        // Função para animações
        function doAnimations(elements) {
          const animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend'
          elements.each(function () {
            const $this = $(this)
            const $animationDelay = $this.data('delay')
            const $animationType = 'animated ' + $this.data('animation')
            $this.css({
              'animation-delay': $animationDelay,
              '-webkit-animation-delay': $animationDelay
            })
            $this.addClass($animationType).one(animationEndEvents, function () {
              $this.removeClass($animationType)
            })
          })
        }

        // Aguardar o próximo tick para garantir que o DOM foi atualizado
        setTimeout(() => {
          // Adicionar event listeners antes de inicializar
          slider.on('init', function (e, slick) {
            const $firstAnimatingElements = $('.single-banner:first-child').find('[data-animation]')
            doAnimations($firstAnimatingElements)
          })

          slider.on('beforeChange', function (e, slick, currentSlide, nextSlide) {
            const $animatingElements = $('.single-banner[data-slick-index="' + nextSlide + '"]').find('[data-animation]')
            doAnimations($animatingElements)
          })

          // Usar tempo de transição da configuração global do portal
          // Converter segundos para milissegundos (slick usa milissegundos)
          const tempoTransicaoMs = tempoTransicaoCarrossel * 1000
          
          // Inicializar o slider sempre começando no primeiro slide (mais antigo)
          slider.slick({
            autoplay: destaques.length > 1, // Só autoplay se houver mais de um destaque
            autoplaySpeed: tempoTransicaoMs,
            speed: 800, // Velocidade da transição entre slides (em ms)
            infinite: destaques.length > 1, // Loop infinito se houver mais de um destaque
            fade: true,
            cssEase: 'linear', // Transição suave
            pauseOnHover: false, // Não pausar ao passar o mouse
            pauseOnFocus: false, // Não pausar ao focar
            pauseOnDotsHover: false,
            dots: false,
            arrows: destaques.length > 1, // Só mostrar setas se houver mais de um destaque
            prevArrow: '<span class="prev"><i class="fa-solid fa-arrow-left"></i></span>',
            nextArrow: '<span class="next"><i class="fa-solid fa-arrow-right"></i></span>',
            swipe: true,
            touchMove: true,
            accessibility: true,
            adaptiveHeight: false,
            initialSlide: 0, // Sempre começar no primeiro slide (mais antigo)
          })
          
          // Garantir que está no primeiro slide após inicialização (sempre começar no mais antigo)
          slider.slick('slickGoTo', 0, false)
          
          console.log('⏱️ Tempo de transição configurado:', tempoTransicaoMs, 'ms (', tempoTransicaoCarrossel, 'segundos)')
          console.log('🔄 Autoplay habilitado:', destaques.length > 1)
          console.log('📊 Total de destaques:', destaques.length)
          console.log('📍 Ordem dos destaques no carrossel:', destaques.map((d, i) => `[${i}] ID:${d.id} - ${d.texto}`).join(' → '))
          console.log('✅ Iniciando no primeiro slide (índice 0):', destaques[0]?.texto || 'N/A')
          
          // Verificar se o autoplay está realmente ativo após inicialização
          setTimeout(() => {
            const isAutoplayActive = slider.slick('slickGetOption', 'autoplay')
            console.log('✅ Autoplay está ativo?', isAutoplayActive)
            if (!isAutoplayActive && destaques.length > 1) {
              console.warn('⚠️ Autoplay não está ativo, tentando reativar...')
              slider.slick('slickSetOption', 'autoplay', true, true)
            }
          }, 500)
          
          console.log('Slider inicializado com sucesso')
        }, 100)
      }

      // Aguardar um pouco para garantir que o DOM está renderizado
      setTimeout(initializeBannerSlider, 200)
    }, 300) // Delay maior para garantir que o React terminou de renderizar

    // Cleanup: destruir o slider quando o componente desmontar ou destaques mudarem
    return () => {
      clearTimeout(timeoutId)
      if (typeof window.jQuery !== 'undefined') {
        const $ = window.jQuery
        const slider = $('.banner-slider-active')
        if (slider.length > 0 && slider.hasClass('slick-initialized')) {
          try {
            slider.off('init beforeChange')
            slider.slick('unslick')
          } catch (e) {
            console.warn('Erro ao limpar slider:', e)
          }
        }
      }
    }
  }, [destaques, tempoTransicaoCarrossel])

  const loadData = async () => {
    try {
      setLoading(true)
      console.log('Iniciando carregamento de dados...')
      
      // Carregar configuração do portal primeiro
      try {
        console.log('🔍 Buscando configuração do portal...')
        const config = await apiService.getConfiguracaoPortal()
        console.log('✅ Configuração do portal carregada:', config)
        if (config && config.tempoTransicaoCarrossel) {
          setTempoTransicaoCarrossel(config.tempoTransicaoCarrossel)
        }
      } catch (error) {
        console.warn('⚠️ Erro ao carregar configuração do portal, usando padrão (5s):', error)
      }

      // Carregar destaques separadamente para melhor tratamento de erros
      let destaquesData = []
      try {
        console.log('🔍 Buscando destaques da API...')
        const response = await apiService.getDestaquesSite()
        console.log('📦 Resposta bruta recebida:', response)
        console.log('📦 Tipo da resposta:', typeof response, 'É array?', Array.isArray(response))
        
        // A resposta pode vir como array direto ou dentro de um objeto
        if (Array.isArray(response)) {
          destaquesData = response
        } else if (response && Array.isArray(response.data)) {
          destaquesData = response.data
        } else if (response && response.data) {
          destaquesData = Array.isArray(response.data) ? response.data : [response.data]
        } else {
          console.warn('⚠️ Formato de resposta inesperado:', response)
          destaquesData = []
        }
        
        console.log('✅ Destaques processados da resposta:', destaquesData)
      } catch (destaquesError) {
        console.error('❌ Erro ao buscar destaques:', destaquesError)
        console.error('Detalhes do erro:', destaquesError.response || destaquesError.message)
        destaquesData = []
      }
      
      const [eventsData, ministriesData, postsData] = await Promise.all([
        apiService.getEvents().catch(err => {
          console.warn('Erro ao buscar eventos:', err)
          return []
        }),
        apiService.getMinistries().catch(err => {
          console.warn('Erro ao buscar ministérios:', err)
          return []
        }),
        apiService.getPosts({ limit: 3 }).catch(err => {
          console.warn('Erro ao buscar posts:', err)
          return []
        })
      ])

      // Processar eventos: pegar todos, ordenar por data (mais recente primeiro) e limitar a 2
      let processedEvents = []
      if (Array.isArray(eventsData)) {
        processedEvents = eventsData
          .sort((a, b) => {
            const dateA = new Date(a.dataInicio || a.data || a.date || 0)
            const dateB = new Date(b.dataInicio || b.data || b.date || 0)
            return dateB - dateA // Mais recente primeiro
          })
          .slice(0, 2) // Apenas os 2 mais recentes
      }
      
      console.log('Eventos recebidos da API:', eventsData)
      console.log('Eventos processados para Home:', processedEvents)
      
      setUpcomingEvents(processedEvents)
      setMinistries(Array.isArray(ministriesData) ? ministriesData : [])
      setLatestPosts(Array.isArray(postsData) ? postsData : [])
      
      // Processar destaques: manter ordem do backend (mais antigo primeiro, por DataCriacao e ID)
      let processedDestaques = []
      if (Array.isArray(destaquesData) && destaquesData.length > 0) {
        // Não reordenar - manter a ordem do backend (já ordenado por DataCriacao crescente, depois ID)
        processedDestaques = destaquesData
        console.log('✅ Destaques processados (ordem do backend - mais antigo primeiro):', processedDestaques.map((d, index) => ({ 
          posicao: index + 1,
          id: d.id, 
          texto: d.texto, 
          imagem: d.imagem,
          dataCriacao: d.dataCriacao 
        })))
      } else {
        console.warn('⚠️ Nenhum destaque retornado ou array vazio.')
        console.warn('Tipo de destaquesData:', typeof destaquesData, 'É array?', Array.isArray(destaquesData))
        console.warn('Valor de destaquesData:', destaquesData)
      }
      
      console.log('📝 Definindo estado - processedDestaques.length:', processedDestaques.length)
      setDestaques(processedDestaques)
      setDestaquesLoaded(true) // Marcar que já tentou carregar
      
      console.log('📊 Estado definido - destaques.length será:', processedDestaques.length, 'destaquesLoaded será: true')
      
      if (processedEvents.length > 0) {
        console.log('Eventos carregados com sucesso:', processedEvents.length)
      } else {
        console.warn('Nenhum evento retornado da API')
      }
      
      if (processedDestaques.length > 0) {
        console.log('Destaques carregados com sucesso:', processedDestaques.length)
      } else {
        console.warn('Nenhum destaque retornado da API')
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados da página inicial:', error)
      setUpcomingEvents([])
      // Não marcar destaquesLoaded como true em caso de erro geral
      // para que possa tentar novamente
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const maskWhatsApp = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    
    // Aplica a máscara conforme o tamanho
    if (numbers.length <= 2) {
      return numbers
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
    } else {
      // Limita a 11 dígitos (formato celular: (XX) XXXXX-XXXX)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
    }
  }

  const handlePrayerFormChange = (e) => {
    const target = e.target
    let value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    // Aplicar máscara se for o campo WhatsApp
    if (name === 'whatsApp') {
      value = maskWhatsApp(value)
    }

    setPrayerFormData({
      ...prayerFormData,
      [name]: value
    })
  }

  const validatePrayerForm = () => {
    const errors = []

    if (!prayerFormData.nome.trim()) {
      errors.push('Por favor, preencha o campo Nome.')
    }

    // Validar WhatsApp (remover máscara e verificar se tem pelo menos 10 dígitos)
    const whatsAppNumbers = prayerFormData.whatsApp.replace(/\D/g, '')
    if (!whatsAppNumbers || whatsAppNumbers.length < 10) {
      errors.push('Por favor, preencha o campo WhatsApp com um número válido.')
    }

    if (!prayerFormData.membro) {
      errors.push('Por favor, selecione se é membro da igreja.')
    }

    if (!prayerFormData.mensagem.trim()) {
      errors.push('Por favor, preencha o campo Mensagem.')
    }

    return errors
  }

  const handlePrayerFormSubmit = async (e) => {
    e.preventDefault()
    setPrayerLoading(true)
    setPrayerMessage({ type: '', text: '' })

    // Validação customizada em português
    const errors = validatePrayerForm()
    if (errors.length > 0) {
      setPrayerMessage({ type: 'error', text: errors[0] })
      setPrayerLoading(false)
      return
    }

    try {
      // Remover máscara do WhatsApp antes de enviar (apenas números)
      const whatsAppNumbers = prayerFormData.whatsApp.replace(/\D/g, '')
      
      await apiService.sendContact({
        nome: prayerFormData.nome,
        whatsApp: whatsAppNumbers,
        email: prayerFormData.email || null,
        membro: prayerFormData.membro === 'Sim',
        mensagem: prayerFormData.mensagem
      })
      setPrayerMessage({ type: 'success', text: 'Mensagem enviada com sucesso! Entraremos em contato em breve.' })
      setPrayerFormData({
        nome: '',
        whatsApp: '',
        email: '',
        membro: '',
        mensagem: ''
      })
    } catch (error) {
      setPrayerMessage({ type: 'error', text: 'Erro ao enviar mensagem. Por favor, tente novamente.' })
      console.error('Erro ao enviar mensagem:', error)
    } finally {
      setPrayerLoading(false)
    }
  }

  // Função para verificar se URL é externa
  const isExternalUrl = (url) => {
    if (!url) return false
    return url.startsWith('http://') || url.startsWith('https://')
  }

  // Função para construir URL completa da imagem
  const getImageUrl = (imagem) => {
    if (!imagem) {
      return '/images/banner1.png' // Fallback padrão
    }
    
    // Se já for uma URL completa, retornar como está
    if (imagem.startsWith('http://') || imagem.startsWith('https://')) {
      return imagem
    }
    
    // Se começar com /uploads, construir URL completa da API
    if (imagem.startsWith('/uploads')) {
      const baseURL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000'
      return `${baseURL}${imagem}`
    }
    
    // Se for apenas o nome do arquivo ou caminho relativo
    return imagem.startsWith('/') ? imagem : `/${imagem}`
  }

  // Debug: verificar estado antes de renderizar
  if (destaquesLoaded) {
    console.log('🎨 Renderizando - destaquesLoaded:', destaquesLoaded, 'destaques.length:', destaques?.length)
    if (destaques && destaques.length > 0) {
      console.log('✅ Renderizando destaques:', destaques.map(d => ({ id: d.id, texto: d.texto })))
    } else {
      console.warn('⚠️ destaquesLoaded=true mas sem destaques. Mostrando fallback.')
    }
  }

  return (
    <div className="home-page">
      {/* Banner Slider - Dinâmico baseado em Destaques do Site */}
      {destaquesLoaded && destaques && destaques.length > 0 ? (
        <section className="banner-slider banner-slider-three banner-slider-active">
          {destaques.map((destaque) => {
            const imageUrl = getImageUrl(destaque.imagem)
            return (
            <div 
              key={`destaque-${destaque.id}`} 
              className="single-banner" 
              style={{ backgroundImage: `url(${imageUrl})` }}
            >
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-lg-9">
                    <div className="banner-text">
                      <div className="banner-content">
                        <h1 data-animation="fadeInLeft" data-delay="0.6s" className="title">
                          {destaque.texto.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                              {line}
                              {i < destaque.texto.split('\n').length - 1 && <br />}
                            </React.Fragment>
                          ))}
                        </h1>
                        {destaque.descricao && (
                          <p data-animation="fadeInLeft" data-delay=".9s">
                            {destaque.descricao}
                          </p>
                        )}
                        {destaque.url && (
                          isExternalUrl(destaque.url) ? (
                            // URL externa: usar tag <a> normal com target="_blank"
                            <a
                              href={destaque.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-animation="fadeInUp"
                              data-delay="1.1s"
                              className="main-btn rounded-btn icon-right small-size"
                            >
                              Saiba Mais <i className="fa-solid fa-arrow-right"></i>
                            </a>
                          ) : (
                            // URL interna: usar Link do React Router (suporta URLs relativas e âncoras)
                            <Link
                              data-animation="fadeInUp"
                              data-delay="1.1s"
                              className="main-btn rounded-btn icon-right small-size"
                              to={destaque.url}
                            >
                              Saiba Mais <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )
          })}
        </section>
      ) : destaquesLoaded ? (
        // Fallback: banners padrão se não houver destaques cadastrados (apenas após tentar carregar)
        <section className="banner-slider banner-slider-three banner-slider-active">
          <div className="single-banner" style={{ backgroundImage: 'url(/images/banner1.png)' }}>
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-9">
                  <div className="banner-text">
                    <div className="banner-content">
                      <h1 data-animation="fadeInLeft" data-delay="0.6s" className="title">
                        Adore Conosco<br />Todos os Domingos
                      </h1>
                      <p data-animation="fadeInLeft" data-delay=".9s">
                        Junte-se a nós para o culto dominical e adore conosco enquanto nos conectamos com Deus e uns com
                        os outros através da música, oração e comunidade.
                      </p>
                      <Link
                        data-animation="fadeInUp"
                        data-delay="1.1s"
                        className="main-btn rounded-btn icon-right small-size"
                        to="/sobre"
                      >
                        Saiba Mais <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        // Mostrar nada enquanto carrega (evita mostrar fallback antes de tentar carregar)
        <div style={{ minHeight: '500px' }}></div>
      )}

      {/* About Section */}
      <section className="about-section section-gap about-with-shape">
        <div className="main-container">
          <div className="about-text-block">
            <div className="row justify-content-between align-items-center">
              <div className="col-lg-6">
                <div className="section-title color-3 mb-md-gap-30 wow fadeInLeft" data-wow-delay="0.3s">
                  <h2 className="title">Bem-vindo à Kingdom</h2>
                </div>
              </div>
              <div className="section-text col-lg-6 wow fadeInRight" data-wow-delay="0.3s">
                <p style={{ marginTop: '0' }}>
                  Somos uma comunidade cristocêntrica e orgânica, formada por pessoas que desejam manifestar Cristo na vida comum.
                </p>
                <p style={{ marginTop: '20px' }}>
                  Promovemos conexões reais — com Cristo, com a fé e com a comunidade.
                </p>
                <p style={{ marginTop: '20px' }}>
                  Aqui, homens e mulheres caminham juntos sob o governo de CRISTO JESUS
                </p>
                <Link className="main-btn mt-20" to="/sobre">
                  Saiba Mais
                </Link>
              </div>
            </div>
          </div>

          {/* Service Start */}
          <div className="service-items pt-50">
            <div className="row">
              <div className="col-lg-3 col-md-6 col-sm-6 wow fadeInLeft" data-wow-delay="0.3s">
                <div className="service-item color-4 text-center mt-30">
                  <div className="icon">
                    <i className="fa-solid fa-church"></i>
                  </div>
                  <h5 className="title">
                    <Link to="/sobre">Nossa História</Link>
                  </h5>
                  <p>Somos uma comunidade cristocêntrica e orgânica, formada por pessoas que desejam manifestar Cristo na vida comum...</p>
                  <div className="readmorebtn">
                    <Link to="/sobre">
                      Saiba Mais <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay="0.4s">
                <div className="service-item color-3 text-center mt-30">
                  <div className="icon">
                    <i className="fa-solid fa-cross"></i>
                  </div>
                  <h5 className="title">
                    <Link to="/sobre#missao">Nossa Missão</Link>
                  </h5>
                  <p>Nossa missão é servir ao Senhor Jesus e tornar Seu amor conhecido por todos através de nossas ações e palavras.</p>
                  <div className="readmorebtn">
                    <Link to="/sobre#missao">
                      Saiba Mais <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay="0.5s">
                <div className="service-item color-2 text-center mt-30">
                  <div className="icon">
                    <i className="fa-solid fa-place-of-worship"></i>
                  </div>
                  <h5 className="title">
                    <Link to="/ministerios">Nossos Ministérios</Link>
                  </h5>
                  <p>Nossa visão é criar uma comunidade vibrante e inclusiva, onde pessoas de todas as origens possam vir...</p>
                  <div className="readmorebtn">
                    <Link to="/ministerios">
                      Saiba Mais <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6 wow fadeInRight" data-wow-delay="0.6s">
                <div className="service-item color-1 text-center mt-30">
                  <div className="icon">
                    <i className="fa-sharp fa-solid fa-location-dot"></i>
                  </div>
                  <h5 className="title">
                    <Link to="/contato">Nossa Localização</Link>
                  </h5>
                  <p>Visite a Kingdom e experimente o calor e o espírito acolhedor de nossa congregação.</p>
                  <div className="readmorebtn">
                    <Link to="/contato">
                      Saiba Mais <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Service End */}
        </div>
        <div className="about-shape-1">
          <img src="/assets/img/shape/about-shape-01.png" alt="shape" />
        </div>
        <div className="about-shape-2">
          <img src="/assets/img/shape/about-shape-02.png" alt="shape" />
        </div>
      </section>

      {/* Video Cta Start */}
      <section className="video-cta" style={{ backgroundImage: 'url(/images/about.png)' }}>
        <div className="main-container">
          <div className="row align-items-center justify-content-between">
            <div className="col-xl-8 col-lg-9 wow fadeInLeft" data-wow-delay="0.3s">
              <div className="video-cta-content">
                <h3 className="title">Kingdom</h3>
              </div>
            </div>
            <div className="col-auto wow fadeInRight" data-wow-delay="0.3s">
              <div className="video-cta-play">
                <a className="video-popup" href="#">
                  <i className="fas fa-play"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Video Cta End */}

      {/* Service Area Start */}
      <section className="service-section section-gap service-with-shape">
        <div className="main-container">
          <div className="section-title white-color text-center mb-10">
            <div className="row justify-content-center">
              <div className="col-xl-7 col-lg-9">
                <span className="title-tag">Kingdom</span>
                <h2 className="title">Nossos Ministérios</h2>
              </div>
            </div>
            <div className="ring-shape"></div>
          </div>
          <div className="row justify-content-center">
            {loading ? (
              <div className="col-12 text-center">
                <p>Carregando ministérios...</p>
              </div>
            ) : ministries.length > 0 ? (
              ministries.slice(0, 3).map((ministry) => (
                <div key={ministry.id} className="col-lg-4 col-md-4 col-sm-12 wow fadeInUp" data-wow-delay="0.3s">
                  <div className="service-item-four mt-50">
                    <div className="services-thumb">
                      <img src={ministry.image || '/images/youth.png'} alt={ministry.name} />
                    </div>
                    <div className="services-content">
                      <h4 className="title">
                        <Link to={`/ministerios/${ministry.id}`}>{ministry.name}</Link>
                      </h4>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="col-lg-4 col-md-4 col-sm-12 wow fadeInUp" data-wow-delay="0.3s">
                  <div className="service-item-four mt-50">
                    <div className="services-thumb">
                      <img src="/images/youth.png" alt="image" />
                    </div>
                    <div className="services-content">
                      <h4 className="title">
                        <Link to="/ministerios">Jovens</Link>
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12 wow fadeInUp" data-wow-delay="0.3s">
                  <div className="service-item-four mt-50">
                    <div className="services-thumb">
                      <img src="/images/women.png" alt="image" />
                    </div>
                    <div className="services-content">
                      <h4 className="title">
                        <Link to="/ministerios">Mulheres</Link>
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12 wow fadeInUp" data-wow-delay="0.3s">
                  <div className="service-item-four mt-50">
                    <div className="services-thumb">
                      <img src="/images/teen.png" alt="image" />
                    </div>
                    <div className="services-content">
                      <h4 className="title">
                        <Link to="/ministerios">Adolescentes</Link>
                      </h4>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="col-12 text-center mt-40">
              <Link className="main-btn" to="/ministerios">
                Ver Todos os Ministérios
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Service Area End */}

      {/* Testimonials Section Start - Upcoming Events */}
      <section className="testimonials-section section-gap section-padding">
        <div className="main-container">
          <div className="testimonials-top mb-80">
            <div className="row align-items-center justify-content-between">
              <div className="col-lg-6">
                <div className="section-title mb-md-gap-30">
                  <span className="title-tag">Kingdom</span>
                  <h2 className="title">Próximos Eventos</h2>
                </div>
              </div>
              <div className="col-auto">
                <div className="testimonials-arrow"></div>
              </div>
            </div>
          </div>
          <div className="row testimonials-slider-two">
            {loading ? (
              <div className="col-12 text-center">
                <p>Carregando eventos...</p>
              </div>
            ) : upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.id} className="col-lg-6">
                  <div className="testimonial-box-two mb-30">
                    <div className="testimonial-inner">
                      <div className="testimonial-img">
                        <img 
                          src={event.imagem || event.image || '/images/leadership.png'} 
                          alt={event.titulo || event.title || 'Evento'} 
                        />
                      </div>
                      <div className="content">
                        <h2>{event.titulo || event.title || 'Evento'}</h2>
                        <p>{event.descricao || event.description || 'Descrição do evento...'}</p>
                        <ul className="categories">
                          {(event.dataInicio || event.data || event.date) && (
                            <li>
                              <Link to={`/eventos/${event.id}`}>
                                <i className="fa-solid fa-calendar"></i> Data do Evento: {formatDate(event.dataInicio || event.data || event.date)}
                              </Link>
                            </li>
                          )}
                        </ul>
                        <div className="author">
                          <div className="readmorebtn">
                            <Link to={`/eventos/${event.id}`}>
                              Saiba Mais <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>Nenhum evento encontrado no momento.</p>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Testimonials Section Ends */}

      {/* Prayer & Counselling Section Start */}
      <section className="conatct-section-two section-gap" style={{ backgroundImage: 'url(/images/about.png)' }}>
        <div className="main-container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-7">
              <div className="section-title white-color text-center mb-40">
                <span className="title-tag text-color-2">Fale Conosco</span>
                <h2 className="title mb-10">Oração, dúvidas e sugestões!</h2>
              </div>
            </div>
            <div className="col-12">
              <div className="contact-form">
                <form id="prayer-form" onSubmit={handlePrayerFormSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="input-group mt-30">
                        <input
                          type="text"
                          placeholder="Digite seu nome"
                          name="nome"
                          value={prayerFormData.nome}
                          onChange={handlePrayerFormChange}
                        />
                        <span className="icon">
                          <i className="fa-solid fa-user"></i>
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group mt-30">
                        <input
                          type="text"
                          placeholder="(XX) XXXXX-XXXX"
                          name="whatsApp"
                          value={prayerFormData.whatsApp}
                          onChange={handlePrayerFormChange}
                          maxLength={15}
                        />
                        <span className="icon">
                          <i className="fa-brands fa-whatsapp"></i>
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group mt-30">
                        <input
                          type="email"
                          placeholder="Digite seu email (opcional)"
                          name="email"
                          value={prayerFormData.email}
                          onChange={handlePrayerFormChange}
                        />
                        <span className="icon">
                          <i className="fa-solid fa-envelope"></i>
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group mt-30">
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                            height: '70px',
                            padding: '0 30px',
                            paddingRight: '70px',
                            width: '100%',
                            backgroundColor: 'transparent',
                            border: '2px solid rgba(255, 255, 255, 0.2)',
                            color: '#c1d0de',
                            fontSize: '16px'
                          }}
                        >
                          <span style={{ color: '#c1d0de', fontSize: '16px', marginRight: '10px' }}>
                            É membro da igreja?
                          </span>
                          <label
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              cursor: 'pointer',
                              margin: 0,
                              color: '#c1d0de',
                              fontSize: '16px'
                            }}
                          >
                            <input
                              type="radio"
                              name="membro"
                              value="Sim"
                              checked={prayerFormData.membro === 'Sim'}
                              onChange={handlePrayerFormChange}
                              style={{
                                width: '18px',
                                height: '18px',
                                cursor: 'pointer',
                                margin: 0,
                                accentColor: 'var(--primary-color)'
                              }}
                            />
                            <span>Sim</span>
                          </label>
                          <label
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              cursor: 'pointer',
                              margin: 0,
                              color: '#c1d0de',
                              fontSize: '16px'
                            }}
                          >
                            <input
                              type="radio"
                              name="membro"
                              value="Não"
                              checked={prayerFormData.membro === 'Não'}
                              onChange={handlePrayerFormChange}
                              style={{
                                width: '18px',
                                height: '18px',
                                cursor: 'pointer',
                                margin: 0,
                                accentColor: 'var(--primary-color)'
                              }}
                            />
                            <span>Não</span>
                          </label>
                        </div>
                        <span className="icon">
                          <i className="fa-solid fa-church"></i>
                        </span>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="input-group textarea-group mt-30">
                        <textarea
                          placeholder="Digite sua mensagem"
                          name="mensagem"
                          value={prayerFormData.mensagem}
                          onChange={handlePrayerFormChange}
                        ></textarea>
                        <span className="icon">
                          <i className="fa-solid fa-pen-to-square"></i>
                        </span>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="input-group textarea-group mt-30">
                        <button type="submit" className="main-btn small-size ml-auto mr-auto" disabled={prayerLoading}>
                          {prayerLoading ? 'Enviando...' : 'Enviar Mensagem'} <i className="fa-solid fa-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Prayer & Counselling Section End */}

      {/* Latest News Start */}
      <section className="latest-news section-gap">
        <div className="main-container">
          <div className="section-title text-center mb-30">
            <span className="title-tag">Últimas Notícias</span>
            <h2 className="title">Notícias & Artigos</h2>
          </div>
          <div className="row justify-content-center">
            {loading ? (
              <div className="col-12 text-center">
                <p>Carregando notícias...</p>
              </div>
            ) : latestPosts.length > 0 ? (
              latestPosts.map((post, index) => (
                <div key={post.id} className="col-lg-4 col-md-6 col-sm-8 wow fadeInLeft" data-wow-delay="0.3s">
                  <div className="latest-news-box mt-30">
                    <div className="post-thumb">
                      <img className="img-fluid" src={post.image || '/images/truth.png'} alt={post.title} />
                    </div>
                    <div className="post-content">
                      <ul className="post-meta">
                        <li>
                          <a href="#">
                            <i className="fa-solid fa-user"></i> {post.author || 'Admin'}
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fa-solid fa-calendar-days"></i> {formatDate(post.date)}
                          </a>
                        </li>
                      </ul>
                      <h4 className="title">
                        <Link to={`/noticias/${post.id}`}>{post.title}</Link>
                      </h4>
                      <Link to={`/noticias/${post.id}`} className="read-more-btn">
                        Saiba Mais <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="col-lg-4 col-md-6 col-sm-8 wow fadeInLeft" data-wow-delay="0.3s">
                  <div className="latest-news-box mt-30">
                    <div className="post-thumb">
                      <img className="img-fluid" src="/images/truth.png" alt="" />
                    </div>
                    <div className="post-content">
                      <ul className="post-meta">
                        <li>
                          <a href="#">
                            <i className="fa-solid fa-user"></i> Admin
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fa-solid fa-calendar-days"></i> 11 de Janeiro, 2023
                          </a>
                        </li>
                      </ul>
                      <h4 className="title">
                        <Link to="/noticias">A Verdade Está Contida na Igreja ou nas Escrituras?</Link>
                      </h4>
                      <Link to="/noticias" className="read-more-btn">
                        Saiba Mais <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-8 wow fadeInLeft" data-wow-delay="0.3s">
                  <div className="latest-news-box mt-30">
                    <div className="post-thumb">
                      <img className="img-fluid" src="/images/cross.png" alt="" />
                    </div>
                    <div className="post-content">
                      <ul className="post-meta">
                        <li>
                          <a href="#">
                            <i className="fa-solid fa-user"></i> Admin
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fa-solid fa-calendar-days"></i> 21 de Janeiro, 2023
                          </a>
                        </li>
                      </ul>
                      <h4 className="title">
                        <Link to="/noticias">Onde Jesus Morreu?</Link>
                      </h4>
                      <Link to="/noticias" className="read-more-btn">
                        Saiba Mais <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-8 wow fadeInLeft" data-wow-delay="0.3s">
                  <div className="latest-news-box mt-30">
                    <div className="post-thumb">
                      <img className="img-fluid" src="/images/books.png" alt="" />
                    </div>
                    <div className="post-content">
                      <ul className="post-meta">
                        <li>
                          <a href="#">
                            <i className="fa-solid fa-user"></i> Admin
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fa-solid fa-calendar-days"></i> 30 de Janeiro, 2023
                          </a>
                        </li>
                      </ul>
                      <h4 className="title">
                        <Link to="/noticias">Quantos Livros Tem a Bíblia?</Link>
                      </h4>
                      <Link to="/noticias" className="read-more-btn">
                        Saiba Mais <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      {/* Latest News End */}

      {/* Counter Part Start - Social Community */}
      <section className="counter-section secondary-bg pt-100 pb-100">
        <div className="main-container">
          <div className="section-title white-color text-center mb-40">
            <div className="row justify-content-center">
              <div className="col-xl-7 col-lg-9">
                <span className="title-tag">Kingdom</span>
                <h2 className="title">Comunidade Social</h2>
              </div>
            </div>
            <div className="ring-shape"></div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-sm-6 wow fadeInLeft" data-wow-delay="0.3s">
              <div className="counter-box color-1">
                <div className="icon">
                  <i className="fa-brands fa-facebook-f"></i>
                </div>
                <a className="main1-btn" href="#">
                  Siga-nos
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="counter-box color-2 mt-40 mb-xs-gap-40">
                <div className="icon">
                  <i className="fa-brands fa-tiktok"></i>
                </div>
                <a className="main1-btn" href="https://www.tiktok.com/@kingdom.reino" target="_blank" rel="noopener noreferrer">
                  Siga-nos
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="counter-box color-3">
                <div className="icon">
                  <i className="fa-brands fa-instagram"></i>
                </div>
                <a className="main1-btn" href="https://www.instagram.com/kingdom.gru" target="_blank" rel="noopener noreferrer">
                  Siga-nos
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInRight" data-wow-delay="0.3s">
              <div className="counter-box color-1 mt-40">
                <div className="icon">
                  <i className="fa-brands fa-youtube"></i>
                </div>
                <a className="main1-btn" href="https://www.youtube.com/c/REINOCHURCHGRU" target="_blank" rel="noopener noreferrer">
                  Inscreva-se
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Counter Part End */}

      {/* Toast Notification */}
      <Toast
        message={prayerMessage.text}
        type={prayerMessage.type}
        onClose={() => setPrayerMessage({ type: '', text: '' })}
      />
    </div>
  )
}

export default Home
