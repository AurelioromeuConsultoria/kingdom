import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.css'

const BREAKPOINT_MOBILE = 1199 // menu hamburger abaixo disso; notebook >= 1200 mantém menu inline

function Header({ churchInfo, loading }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState(null) // 'sobre' | 'voluntarios' | 'servos' | null
  const [isBreakpoint, setIsBreakpoint] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= BREAKPOINT_MOBILE : true
  )
  const location = useLocation()

  useEffect(() => {
    const check = () => setIsBreakpoint(window.innerWidth <= BREAKPOINT_MOBILE)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    // Fechar menu ao mudar de rota
    setIsMenuOpen(false)
  }, [location])

  useEffect(() => {
    // Remover ícone de "+" apenas dos itens de menu que não têm submenu (quando jQuery do template existir)
    const removeUnnecessaryMenuIcons = () => {
      if (typeof window.jQuery !== 'undefined') {
        const $ = window.jQuery
        setTimeout(() => {
          $('.primary-menu > li').each(function () {
            const $li = $(this)
            const $submenu = $li.children('ul.submenu')
            if ($submenu.length === 0) {
              $li.find('> .dd-trigger').remove()
            }
          })
        }, 150)
      }
    }
    removeUnnecessaryMenuIcons()
    const timeout = setTimeout(removeUnnecessaryMenuIcons, 300)
    return () => clearTimeout(timeout)
  }, [isMenuOpen, location])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const toggleSubmenu = (key) => {
    setOpenSubmenu((prev) => (prev === key ? null : key))
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

      {/* Navigation - breakpoint-on ativa menu hamburger (CSS do template); sem main.js do template, controlamos aqui */}
      <div className={`header-navigation${isBreakpoint ? ' breakpoint-on' : ''}`}>
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
                <li className={openSubmenu === 'sobre' ? 'submenu-open' : ''}>
                  <a href="#" onClick={(e) => { e.preventDefault(); toggleSubmenu('sobre'); }}>Sobre</a>
                  <span className={`dd-trigger ${openSubmenu === 'sobre' ? 'open' : ''}`} onClick={(e) => { e.preventDefault(); toggleSubmenu('sobre'); }} aria-label={openSubmenu === 'sobre' ? 'Fechar submenu' : 'Abrir submenu'}><i className={openSubmenu === 'sobre' ? 'fa-regular fa-minus' : 'fa-regular fa-plus'}></i></span>
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
                <li className={`${location.pathname.startsWith('/voluntarios') ? 'current' : ''} ${openSubmenu === 'voluntarios' ? 'submenu-open' : ''}`.trim()}>
                  <a href="#" onClick={(e) => { e.preventDefault(); toggleSubmenu('voluntarios'); }}>Voluntariado</a>
                  <span className={`dd-trigger ${openSubmenu === 'voluntarios' ? 'open' : ''}`} onClick={(e) => { e.preventDefault(); toggleSubmenu('voluntarios'); }} aria-label={openSubmenu === 'voluntarios' ? 'Fechar submenu' : 'Abrir submenu'}><i className={openSubmenu === 'voluntarios' ? 'fa-regular fa-minus' : 'fa-regular fa-plus'}></i></span>
                  <ul className="submenu">
                    <li>
                      <Link to="/voluntarios" onClick={closeMenu} className={isActive('/voluntarios') && !location.pathname.includes('equipes') ? 'current' : ''}>Voluntariado</Link>
                    </li>
                    <li>
                      <Link to="/voluntarios/equipes" onClick={closeMenu} className={isActive('/voluntarios/equipes') ? 'current' : ''}>Equipes</Link>
                    </li>
                  </ul>
                </li>
                <li className={`${location.pathname.startsWith('/servos') ? 'current' : ''} ${openSubmenu === 'servos' ? 'submenu-open' : ''}`.trim()}>
                  <a href="#" onClick={(e) => { e.preventDefault(); toggleSubmenu('servos'); }}>Servos</a>
                  <span className={`dd-trigger ${openSubmenu === 'servos' ? 'open' : ''}`} onClick={(e) => { e.preventDefault(); toggleSubmenu('servos'); }} aria-label={openSubmenu === 'servos' ? 'Fechar submenu' : 'Abrir submenu'}><i className={openSubmenu === 'servos' ? 'fa-regular fa-minus' : 'fa-regular fa-plus'}></i></span>
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
                  <Link to="/hub" onClick={closeMenu} className={isActive('/hub')}>Hub</Link>
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
