import { Link } from 'react-router-dom'
import './Footer.css'

function Footer({ churchInfo, loading }) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer-area footer-area-two">
      <div className="main-container">
        <div className="row footer-widgets">
          <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4">
            <div className="footerstyle about-widget">
              <div className="logo">
                <img
                  id="footer-logo-img"
                  className="img-center"
                  src="/images/logo-white.png"
                  alt="logo"
                  width="180"
                />
              </div>
              <p>
                {loading
                  ? 'Carregando...'
                  : churchInfo?.description ||
                    'Somos uma comunidade cristocêntrica e orgânica, formada por pessoas que desejam manifestar Cristo na vida comum.'}
              </p>
            </div>
          </div>

          <div className="col-sm-6 col-md-6 col-lg-2 col-xl-2">
            <div className="nav-widget">
              <h4 className="mrt-20 mrt-40">Links Rápidos</h4>
              <div>
                <ul className="footerstyle">
                  <li>
                    <Link to="/sobre">
                      <i className="fa-solid fa-arrow-right"></i> Nossa História
                    </Link>
                  </li>
                  <li>
                    <Link to="/sobre#visao">
                      <i className="fa-solid fa-arrow-right"></i> Visão & Missão
                    </Link>
                  </li>
                  <li>
                    <Link to="/sobre#lideranca">
                      <i className="fa-solid fa-arrow-right"></i> Nossa Liderança
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-md-6 col-lg-2 col-xl-2">
            <div className="nav-widget">
              <h4 className="mrt-10 mrt-40">Links</h4>
              <div>
                <ul className="footerstyle">
                  <li>
                    <Link to="/voluntarios">Voluntariado</Link>
                  </li>
                  <li>
                    <Link to="/voluntarios/equipes">Equipes (Voluntariado)</Link>
                  </li>
                  <li>
                    <Link to="/servos">Servos</Link>
                  </li>
                  <li>
                    <Link to="/servos/equipes">Equipes</Link>
                  </li>
                  <li>
                    <Link to="/kids">Kids</Link>
                  </li>
                  <li>
                    <Link to="/hub">Hub</Link>
                  </li>
                  <li>
                    <Link to="/eventos">Eventos</Link>
                  </li>
                  <li>
                    <Link to="/noticias">Notícias</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mrt-10 col-sm-6 col-md-6 col-lg-2 col-xl-2">
            <div className="contact-widget2">
              <h4 className="mrt-40">Contato</h4>
              <ul className="contactstyle">
                <li>
                  <i className="fa-solid fa-envelope"></i>{' '}
                  {loading ? (
                    'Carregando...'
                  ) : (
                    <a href={`mailto:${churchInfo?.contact?.email || 'contato@kingdombr.com.br'}`}>
                      {churchInfo?.contact?.email || 'contato@kingdombr.com.br'}
                    </a>
                  )}
                </li>
                <li>
                  <i className="fa-solid fa-phone"></i>{' '}
                  {loading ? (
                    'Carregando...'
                  ) : (
                    <a
                      href={`https://wa.me/55${(churchInfo?.contact?.phone || '11947934943').replace(/\D/g, '').replace(/^55/, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {churchInfo?.contact?.phone || '11 94793-4943'}
                    </a>
                  )}
                </li>
                <li className="footer-address-item">
                  <i className="fa-solid fa-location-dot"></i>{' '}
                  {loading ? (
                    'Carregando...'
                  ) : (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(churchInfo?.contact?.address || 'Av. Monte Alegre, 894 - Cidade Soberana, Guarulhos - SP, 07161-150')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {churchInfo?.contact?.address || 'Av. Monte Alegre, 894 - Cidade Soberana, Guarulhos - SP, 07161-150'}
                    </a>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <p>
            Copyright © {currentYear} {loading ? 'Kingdom' : churchInfo?.name || 'Kingdom'} | Todos os Direitos
            Reservados
          </p>
          <a
            href="https://malachdigital.com.br/"
            target="_blank"
            rel="noreferrer"
            className="footer-malach"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="footer-malach-icon"
              fill="currentColor"
            >
              <path d="M3 20V4h4l5 5 5-5h4v16h-4V10l-5 5-5-5v10H3z" />
            </svg>
            <span>Desenvolvido por Malach Digital</span>
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
