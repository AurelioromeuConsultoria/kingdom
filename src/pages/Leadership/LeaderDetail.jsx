import { useParams, Link } from 'react-router-dom'
import '../../styles/shared-pages.css'
import './LeaderDetail.css'

// Dados dos líderes
const leadersData = {
  'sandro-lopez': {
    name: 'Ap. Sandro Lopez',
    position: 'Apóstolo',
    image: '/images/team1.png',
    description: 'A managing director is someone who is responsible for the daily operations of a company, organization, or corporate division. In some countries, the term is equivalent to CEO (Chief Executive Officer) the executive head of a company. In other countries, managing directors primarily work as the heads of individual business units within a company rather than heading up the company as a whole. As a member of senior management, the managing director is also expected to keep a company solvent and to promote expansion and innovation within the industry.',
    social: {
      facebook: 'https://www.facebook.com/',
      twitter: 'https://www.twitter.com/',
      instagram: 'https://www.instagram.com/',
      linkedin: 'https://www.linkedin.com/'
    }
  },
  'marta-silva': {
    name: 'Bp. Marta Silva',
    position: 'Bispa',
    image: '/images/team2.png',
    description: 'A managing director is someone who is responsible for the daily operations of a company, organization, or corporate division. In some countries, the term is equivalent to CEO (Chief Executive Officer) the executive head of a company. In other countries, managing directors primarily work as the heads of individual business units within a company rather than heading up the company as a whole. As a member of senior management, the managing director is also expected to keep a company solvent and to promote expansion and innovation within the industry.',
    social: {
      facebook: 'https://www.facebook.com/',
      twitter: 'https://www.twitter.com/',
      instagram: 'https://www.instagram.com/',
      linkedin: 'https://www.linkedin.com/'
    }
  },
  'ednei-silva': {
    name: 'Pr. Ednei Silva',
    position: 'Pastor',
    image: '/images/team3.png',
    description: 'A managing director is someone who is responsible for the daily operations of a company, organization, or corporate division. In some countries, the term is equivalent to CEO (Chief Executive Officer) the executive head of a company. In other countries, managing directors primarily work as the heads of individual business units within a company rather than heading up the company as a whole. As a member of senior management, the managing director is also expected to keep a company solvent and to promote expansion and innovation within the industry.',
    social: {
      facebook: 'https://www.facebook.com/',
      twitter: 'https://www.twitter.com/',
      instagram: 'https://www.instagram.com/',
      linkedin: 'https://www.linkedin.com/'
    }
  }
}

function LeaderDetail() {
  const { slug } = useParams()
  const leader = leadersData[slug]

  if (!leader) {
    return (
      <div className="leader-detail-page">
        <section className="page-title-area">
          <div className="container">
            <h2 className="title">Líder não encontrado</h2>
            <ul className="breadcrumb-nav">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/lideranca">Nossa Liderança</Link>
              </li>
              <li className="active">Não encontrado</li>
            </ul>
          </div>
        </section>
        <section className="section-gap">
          <div className="container">
            <div className="row">
              <div className="col-12 text-center">
                <p>Líder não encontrado.</p>
                <Link to="/lideranca" className="main-btn mt-30">
                  Voltar para Liderança
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="leader-detail-page">
      {/* Page Title */}
      <section className="page-title-area">
        <div className="container">
          <h2 className="title">Nossa Liderança</h2>
          <ul className="breadcrumb-nav">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/lideranca">Nossa Liderança</Link>
            </li>
            <li className="active">{leader.name}</li>
          </ul>
        </div>
      </section>

      {/* Team Details Section */}
      <section className="team-area section-gap">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-6 col-md-10">
              <div className="team-details-thumb mb-md-gap-50">
                <img
                  className="img-fluid auto_size mt_70"
                  src={leader.image}
                  alt={leader.name}
                  height="560"
                  width="470"
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-10">
              <div className="team-details-content">
                <h4 className="title">{leader.name}</h4>
                <span>{leader.position}</span>
                <p className="pb-15">{leader.description}</p>
                <ul className="social-links">
                  <li>
                    <a href={leader.social.facebook} target="_blank" rel="noopener noreferrer">
                      <i className="fa-brands fa-facebook-f"></i>
                    </a>
                  </li>
                  <li>
                    <a href={leader.social.twitter} target="_blank" rel="noopener noreferrer">
                      <i className="fa-brands fa-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href={leader.social.instagram} target="_blank" rel="noopener noreferrer">
                      <i className="fa-brands fa-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href={leader.social.linkedin} target="_blank" rel="noopener noreferrer">
                      <i className="fa-brands fa-linkedin"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LeaderDetail




