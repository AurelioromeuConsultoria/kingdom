import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.css'

function Header({ churchInfo, loading }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // Fechar menu ao mudar de rota
    setIsMenuOpen(false)
  }, [location])

  useEffect(() => {
    // Remover ícone de "+" apenas dos itens de menu que não têm submenu
    // O JavaScript do template adiciona automaticamente esse ícone baseado no próximo elemento
    // Precisamos garantir que apenas itens SEM submenu tenham o ícone removido
    const removeUnnecessaryMenuIcons = () => {
      if (typeof window.jQuery !== 'undefined') {
        const $ = window.jQuery
        // Aguardar o JavaScript do template executar
        setTimeout(() => {
          $('.primary-menu > li').each(function () {
            const $li = $(this)
            // Verificar se realmente tem um submenu diretamente filho (ul.submenu)
            const $submenu = $li.children('ul.submenu')
            const hasSubmenu = $submenu.length > 0
            
            // Se NÃO tem submenu, remover o ícone dd-trigger
            // Se TEM submenu, manter o ícone
            if (!hasSubmenu) {
              $li.find('> .dd-trigger').remove()
            }
          })
        }, 150)
      }
    }

    removeUnnecessaryMenuIcons()
    // Re-executar quando o menu for aberto/fechado ou quando a rota mudar
    const timeout = setTimeout(removeUnnecessaryMenuIcons, 300)
    
    return () => clearTimeout(timeout)
  }, [isMenuOpen, location])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const isActive = (path) => {
    return location.pathname === path ? 'current' : ''
  }

  return (
    <header className="header-one header-full-width sticky-header">
      {/* Topbar */}
      <div className="header-topbar d-none d-sm-block">
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-sm-auto col-12">
              <ul className="contact-info text-center">
                <li>
                  <i className="fa-solid fa-envelope"></i>{' '}
                  {loading ? (
                    <span>Carregando...</span>
                  ) : (
                    <a href={`mailto:${churchInfo?.contact?.email || 'contato@kingdombr.com.br'}`}>
                      {churchInfo?.contact?.email || 'contato@kingdombr.com.br'}
                    </a>
                  )}
                </li>
                <li>
                  <i className="fa-solid fa-phone"></i>{' '}
                  {loading ? (
                    <span>Carregando...</span>
                  ) : (
                    <a href={`tel:${churchInfo?.contact?.phone || '11947934943'}`}>
                      {churchInfo?.contact?.phone || '11 94793-4943'}
                    </a>
                  )}
                </li>
              </ul>
            </div>
            <div className="col-sm-auto col-12">
              <div className="social-icon text-center">
                <ul>
                  {churchInfo?.socialMedia?.facebook && (
                    <li>
                      <a
                        className="social-facebook"
                        href={churchInfo.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-tooltip="Facebook"
                      >
                        <i className="fa-brands fa-facebook-f"></i>
                      </a>
                    </li>
                  )}
                  {churchInfo?.socialMedia?.twitter && (
                    <li>
                      <a
                        className="social-twitter"
                        href={churchInfo.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-tooltip="Twitter"
                      >
                        <i className="fa-brands fa-twitter"></i>
                      </a>
                    </li>
                  )}
                  {churchInfo?.socialMedia?.instagram && (
                    <li>
                      <a
                        className="social-instagram"
                        href={churchInfo.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-tooltip="Instagram"
                      >
                        <i className="fa-brands fa-instagram"></i>
                      </a>
                    </li>
                  )}
                  {churchInfo?.socialMedia?.linkedin && (
                    <li>
                      <a
                        className="social-linkedin"
                        href={churchInfo.socialMedia.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-tooltip="LinkedIn"
                      >
                        <i className="fa-brands fa-linkedin"></i>
                      </a>
                    </li>
                  )}
                  {churchInfo?.socialMedia?.youtube && (
                    <li>
                      <a
                        className="social-youtube"
                        href={churchInfo.socialMedia.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-tooltip="YouTube"
                      >
                        <i className="fa-brands fa-youtube"></i>
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="header-navigation">
        <div className="container d-flex align-items-center justify-content-between">
          <div className="header-left">
            <div className="site-logo">
              <Link to="/">
                <img src="/images/logo.png" alt="logo" width="180" />
              </Link>
            </div>
          </div>
          <div className="header-right d-flex align-items-center justify-content-end">
            <div className={`site-nav-menu ${isMenuOpen ? 'menu-opened' : ''}`}>
              <ul className="primary-menu">
                <li className={isActive('/')}>
                  <Link to="/" onClick={closeMenu}>Home</Link>
                </li>
                <li>
                  <a href="#" onClick={(e) => e.preventDefault()}>Sobre</a>
                  <ul className="submenu">
                    <li>
                      <Link to="/sobre#quem-somos" onClick={closeMenu}>Quem Somos</Link>
                    </li>
                    <li>
                      <Link to="/sobre#essencia" onClick={closeMenu}>Nossa Essência</Link>
                    </li>
                    <li>
                      <Link to="/sobre#missao" onClick={closeMenu}>Nossa Missão</Link>
                    </li>
                    <li>
                      <Link to="/sobre#identidade" onClick={closeMenu}>Nossa Identidade</Link>
                    </li>
                    <li>
                      <Link to="/sobre#simbolos" onClick={closeMenu}>Nossos Símbolos</Link>
                    </li>
                    <li>
                      <Link to="/sobre#cultura" onClick={closeMenu}>Nossa Cultura</Link>
                    </li>
                    <li>
                      <Link to="/sobre#somos-kingdom" onClick={closeMenu}>Somos Kingdom</Link>
                    </li>
                    <li>
                      <Link to="/lideranca" onClick={closeMenu}>Nossa Liderança</Link>
                    </li>
                  </ul>
                </li>
                <li className={location.pathname.startsWith('/voluntarios') ? 'current' : ''}>
                  <a href="#" onClick={(e) => e.preventDefault()}>Voluntariado</a>
                  <ul className="submenu">
                    <li>
                      <Link to="/voluntarios" onClick={closeMenu} className={isActive('/voluntarios') && !location.pathname.includes('equipes') ? 'current' : ''}>Voluntariado</Link>
                    </li>
                    <li>
                      <Link to="/voluntarios/equipes" onClick={closeMenu} className={isActive('/voluntarios/equipes') ? 'current' : ''}>Equipes</Link>
                    </li>
                  </ul>
                </li>
                <li className={location.pathname.startsWith('/servos') ? 'current' : ''}>
                  <a href="#" onClick={(e) => e.preventDefault()}>Servos</a>
                  <ul className="submenu">
                    <li>
                      <Link to="/servos" onClick={closeMenu} className={isActive('/servos') && !location.pathname.includes('equipes') ? 'current' : ''}>Servos</Link>
                    </li>
                    <li>
                      <Link to="/servos/equipes" onClick={closeMenu} className={isActive('/servos/equipes') ? 'current' : ''}>Equipes</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/kids" onClick={closeMenu} className={isActive('/kids')}>Kids</Link>
                </li>
                <li>
                  <Link to="/eventos" onClick={closeMenu}>Eventos</Link>
                </li>
                <li>
                  <Link to="/galeria" onClick={closeMenu}>Fotos</Link>
                </li>
                <li>
                  <Link to="/noticias" onClick={closeMenu}>Notícias</Link>
                </li>
                <li>
                  <Link to="/contato" onClick={closeMenu}>Contato</Link>
                </li>
              </ul>
              <a href="#" className="nav-close" onClick={(e) => { e.preventDefault(); closeMenu(); }}>
                <i className="fal fa-times"></i>
              </a>
            </div>
            <div className="header-extra d-flex align-items-center">
              <div className="offcanvas-widget d-lg-block d-none"></div>
              <div className="nav-toggler" onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="navbar-btn">
                <Link to="/generosidade" onClick={closeMenu}>
                  <i className="fa-solid fa-heart"></i> Generosidade
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
