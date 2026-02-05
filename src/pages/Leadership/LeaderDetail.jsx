import { useParams, Link } from 'react-router-dom'
import '../../styles/shared-pages.css'
import './LeaderDetail.css'

// Dados dos líderes
const leadersData = {
  'sandro-lopez': {
    name: 'Ap. Sandro Lopez',
    position: 'Apóstolo',
    image: '/images/sandro-lopez.png',
    description: 'Apóstolo Sandro Lopez, casado , formado em administração , é líder cristão, pastor e apóstolo com mais de 30 anos de ministério, dedicados de forma contínua e integral ao serviço do Reino de Deus, à edificação da Igreja e à formação de líderes.\n\nIniciou sua atuação  aos 11 anos de idade, quando passou a exercer o chamado para a pregação do Evangelho. Aos 17 anos, assumiu a liderança de sua primeira igreja, dando início a uma trajetória ministerial marcada por fidelidade, responsabilidade espiritual e compromisso com a verdade bíblica. Desde então, mantém atuação ininterrupta no ministério cristão.\n\nReconhecido por seu chamado apostólico, exerce função de alinhamento, governo espiritual e paternidade ministerial, cooperando com igrejas, líderes e famílias no desenvolvimento de maturidade espiritual, emocional e ministerial. Seu ministério é caracterizado pelo ensino da verdade que confronta, restaura e conduz à liberdade, sem viés religioso ou superficial.\n\nSua atuação ministerial contempla áreas como cura interior, formação de caráter, maturidade emocional, governo espiritual e administração responsável da vida e das finanças, com ênfase na aplicação prática do Evangelho no cotidiano.\n\nAtualmente, após mais de três décadas de serviço ministerial, Apóstolo Sandro Lopez  lidera a KINGDOM com a bispa Marta Silva , permanece  comprometido com a edificação do Corpo de Cristo, a formação de líderes íntegros e o cumprimento do propósito de ligar a Vida de Cristo para esta geração.',
    social: {
      facebook: 'https://www.facebook.com/lopez.reino',
      twitter: 'https://www.twitter.com/',
      instagram: 'https://www.instagram.com/sandrolopez.ap/',
      linkedin: 'https://www.linkedin.com/'
    }
  },
  'marta-silva': {
    name: 'Bp. Marta Silva',
    position: 'Bispa',
    image: '/images/marta-silva.png',
    description: 'Bispa Marta Silva é líder cristã com mais de 15 anos de atuação ministerial, exercendo seu chamado com fidelidade às Escrituras, compromisso com a fé cristã e sensibilidade à direção do Espírito Santo.\n\nCasada com o Apóstolo Sandro Lopes, é cofundadora da Kingdom, ministério estabelecido com o propósito de servir à Igreja, promover o ensino da Palavra e conduzir pessoas a um relacionamento genuíno e transformador com Cristo.\n\nMãe de Hanrry Manerich, concilia sua vida familiar com o exercício ministerial, refletindo responsabilidade, equilíbrio e zelo em todas as áreas de sua atuação.\n\nSeu ministério é direcionado especialmente ao cuidado e à edificação de mulheres, com foco no fortalecimento da fé, no alinhamento espiritual à vontade de Deus e no desenvolvimento de uma vida cristã madura e comprometida com os princípios do Reino.\n\nSua trajetória ministerial é marcada pela centralidade de Cristo, não fundamentada em títulos, formações acadêmicas ou reconhecimentos humanos, mas na graça, no serviço e na obediência ao chamado cristão.',
    social: {
      facebook: 'https://www.facebook.com/martasilvabispa',
      twitter: 'https://www.twitter.com/',
      instagram: 'https://www.instagram.com/martasilva.bp/',
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
          <div className="row align-items-start justify-content-center">
            <div className="col-lg-6 col-md-10">
              <div className="team-details-thumb mb-md-gap-50">
                <img
                  className="img-fluid auto_size"
                  src={leader.image}
                  alt={leader.name}
                  height="520"
                  width="470"
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-10">
              <div className="team-details-content">
                <h4 className="title">{leader.name}</h4>
                <span>{leader.position}</span>
                <p className="pb-15" style={{ whiteSpace: 'pre-line' }}>{leader.description}</p>
                <ul className="social-links">
                  <li>
                    <a href={leader.social.facebook} target="_blank" rel="noopener noreferrer">
                      <i className="fa-brands fa-facebook-f"></i>
                    </a>
                  </li>
                  <li>
                    <a href={leader.social.instagram} target="_blank" rel="noopener noreferrer">
                      <i className="fa-brands fa-instagram"></i>
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




