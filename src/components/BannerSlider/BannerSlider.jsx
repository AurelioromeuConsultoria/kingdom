import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import apiService from '../../services/api.service'
import 'swiper/css'
import 'swiper/css/effect-fade'
import './BannerSlider.css'

function BannerSlider({ destaques, tempoTransicaoCarrossel }) {
  const swiperRef = useRef(null)
  const containerRef = useRef(null)
  const swiperInstanceRef = useRef(null)

  const getImageUrl = (imagem) => {
    if (!imagem) return '/images/banner1.png'
    return apiService.getImageUrl(imagem) || '/images/banner1.png'
  }

  // Função para verificar se URL é externa
  const isExternalUrl = (url) => {
    if (!url) return false
    return url.startsWith('http://') || url.startsWith('https://')
  }

  // Configurar navegação customizada usando useEffect
  useEffect(() => {
    if (!swiperInstanceRef.current || destaques.length <= 1) {
      return
    }

    const setupNavigation = () => {
      try {
        if (!containerRef.current) return
        
        const prevButton = containerRef.current.querySelector('.swiper-button-prev-custom')
        const nextButton = containerRef.current.querySelector('.swiper-button-next-custom')
        
        if (prevButton && nextButton && swiperInstanceRef.current) {
          // Remover listeners antigos se existirem
          const prevHandler = () => {
            try {
              swiperInstanceRef.current?.slidePrev()
            } catch (e) {
              console.warn('Erro ao navegar para slide anterior:', e)
            }
          }
          const nextHandler = () => {
            try {
              swiperInstanceRef.current?.slideNext()
            } catch (e) {
              console.warn('Erro ao navegar para próximo slide:', e)
            }
          }
          
          prevButton.onclick = prevHandler
          nextButton.onclick = nextHandler
        }
      } catch (error) {
        console.warn('Erro ao configurar navegação do banner:', error)
      }
    }

    // Aguardar um pouco para garantir que o DOM está pronto
    const timeoutId = setTimeout(setupNavigation, 100)
    
    return () => {
      clearTimeout(timeoutId)
      // Limpar event listeners
      try {
        if (containerRef.current) {
          const prevButton = containerRef.current.querySelector('.swiper-button-prev-custom')
          const nextButton = containerRef.current.querySelector('.swiper-button-next-custom')
          if (prevButton) prevButton.onclick = null
          if (nextButton) nextButton.onclick = null
        }
      } catch (error) {
        // Ignorar erros durante cleanup
      }
    }
  }, [destaques.length])

  // Handler para quando o Swiper estiver pronto
  const handleSwiperReady = (swiper) => {
    try {
      swiperInstanceRef.current = swiper
      // Trigger do useEffect para configurar navegação
      if (destaques.length > 1) {
        // Pequeno delay para garantir que o DOM está pronto
        setTimeout(() => {
          try {
            if (containerRef.current && swiper) {
              const prevButton = containerRef.current.querySelector('.swiper-button-prev-custom')
              const nextButton = containerRef.current.querySelector('.swiper-button-next-custom')
              
              if (prevButton && nextButton) {
                prevButton.onclick = () => {
                  try {
                    swiper.slidePrev()
                  } catch (e) {
                    console.warn('Erro ao navegar para slide anterior:', e)
                  }
                }
                nextButton.onclick = () => {
                  try {
                    swiper.slideNext()
                  } catch (e) {
                    console.warn('Erro ao navegar para próximo slide:', e)
                  }
                }
              }
            }
          } catch (error) {
            console.warn('Erro ao configurar navegação inicial:', error)
          }
        }, 150)
      }
    } catch (error) {
      console.warn('Erro ao inicializar Swiper:', error)
    }
  }

  if (!destaques || destaques.length === 0) {
    return null
  }

  const tempoTransicaoMs = tempoTransicaoCarrossel * 1000

  return (
    <section ref={containerRef} className="banner-slider banner-slider-three banner-slider-active" data-react-managed="true">
      {/* Navegação customizada - renderizar antes do Swiper */}
      {destaques.length > 1 && (
        <>
          <div className="swiper-button-prev-custom">
            <span className="prev">
              <i className="fa-solid fa-arrow-left"></i>
            </span>
          </div>
          <div className="swiper-button-next-custom">
            <span className="next">
              <i className="fa-solid fa-arrow-right"></i>
            </span>
          </div>
        </>
      )}
      
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{
          crossFade: true
        }}
        autoplay={
          destaques.length > 1
            ? {
                delay: tempoTransicaoMs,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
              }
            : false
        }
        speed={800}
        loop={destaques.length > 1}
        slidesPerView={1}
        spaceBetween={0}
        onSwiper={handleSwiperReady}
        onSlideChange={(swiper) => {
          try {
            // Animar elementos do slide atual
            const activeSlide = swiper.slides?.[swiper.activeIndex]
            if (activeSlide) {
              const elements = activeSlide.querySelectorAll('[data-animation]')
              elements.forEach((element) => {
                try {
                  const delay = element.getAttribute('data-delay') || '0s'
                  const animation = element.getAttribute('data-animation')
                  if (animation) {
                    element.style.animationDelay = delay
                    element.style.webkitAnimationDelay = delay
                    element.classList.add('animated', animation)
                  }
                } catch (e) {
                  // Ignorar erros individuais de animação
                }
              })
            }
          } catch (error) {
            console.warn('Erro ao animar slide:', error)
          }
        }}
        onInit={(swiper) => {
          try {
            // Animar elementos do primeiro slide
            const firstSlide = swiper.slides?.[0]
            if (firstSlide) {
              const elements = firstSlide.querySelectorAll('[data-animation]')
              elements.forEach((element) => {
                try {
                  const delay = element.getAttribute('data-delay') || '0s'
                  const animation = element.getAttribute('data-animation')
                  if (animation) {
                    element.style.animationDelay = delay
                    element.style.webkitAnimationDelay = delay
                    element.classList.add('animated', animation)
                  }
                } catch (e) {
                  // Ignorar erros individuais de animação
                }
              })
            }
          } catch (error) {
            console.warn('Erro ao inicializar animações:', error)
          }
        }}
      >
        {destaques.map((destaque) => {
          const imageUrl = getImageUrl(destaque.imagem)
          
          return (
            <SwiperSlide key={`destaque-${destaque.id}`}>
              <div 
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
            </SwiperSlide>
          )
        })}
      </Swiper>
    </section>
  )
}

export default BannerSlider
