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
                    'Somos uma comunidade de crentes comprometidos em seguir os ensinamentos da Bíblia Sagrada e expandir a família de Deus juntos através de Jesus Cristo.'}
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
              <h4 className="mrt-10 mrt-40">Ministérios</h4>
              <div>
                <ul className="footerstyle">
                  <li>
                    <Link to="/ministerios">Jovens</Link>
                  </li>
                  <li>
                    <Link to="/ministerios">Mulheres</Link>
                  </li>
                  <li>
                    <Link to="/ministerios">Crianças/Adolescentes</Link>
                  </li>
                  <li>
                    <Link to="/ministerios">Discipulado</Link>
                  </li>
                  <li>
                    <Link to="/ministerios">Evangelismo</Link>
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
                    <a href={`tel:${churchInfo?.contact?.phone || '11981754437'}`}>
                      {churchInfo?.contact?.phone || '11 98175-4437'}
                    </a>
                  )}
                </li>
                <li>
                  <i className="fa-solid fa-location-dot"></i>{' '}
                  {loading ? 'Carregando...' : churchInfo?.contact?.address || 'Endereço da Igreja Kingdom'}
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
        </div>
      </div>
    </footer>
  )
}

export default Footer

