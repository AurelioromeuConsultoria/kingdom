import { useEffect, useState } from 'react'
import apiService from '../../services/api.service'

function About() {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaders()
  }, [])

  const loadLeaders = async () => {
    try {
      const data = await apiService.getLeaders()
      setLeaders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Erro ao carregar líderes:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="about-page">
      {/* Page Title */}
      <section className="page-title-area">
        <div className="container">
          <h2 className="title">Sobre Nós</h2>
          <ul className="breadcrumb-nav">
            <li>
              <a href="/">Home</a>
            </li>
            <li className="active">Sobre</li>
          </ul>
        </div>
      </section>

      {/* About Content */}
      <section className="about-section section-gap">
        <div className="main-container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title text-center mb-40">
                <h2 className="title">Nossa História</h2>
              </div>
              <div className="about-content">
                <p>
                  Somos uma comunidade de crentes comprometidos em seguir os ensinamentos da Bíblia Sagrada e expandir
                  a família de Deus juntos através de Jesus Cristo. Buscamos transmitir nossa fé às futuras gerações
                  através da Salvação e do Arrependimento, guiados pela Trindade.
                </p>
                <p>
                  Nossa jornada começou com um pequeno grupo de pessoas que buscavam uma conexão mais profunda com
                  Deus e uma comunidade onde pudessem crescer espiritualmente juntos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section id="visao" className="vision-mission-section section-gap soft-blue-bg">
        <div className="main-container">
          <div className="row">
            <div className="col-lg-6">
              <div className="section-title mb-30">
                <h2 className="title">Nossa Visão</h2>
              </div>
              <p>
                Nossa visão é criar uma comunidade vibrante e inclusiva, onde pessoas de todas as origens possam vir
                e experimentar o amor de Deus. Buscamos ser a Kingdom, uma igreja que transforma vidas através do poder do
                Evangelho.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="section-title mb-30">
                <h2 className="title">Nossa Missão</h2>
              </div>
              <p>
                Nossa missão é servir ao Senhor Jesus e tornar Seu amor conhecido por todos através de nossas ações e
                palavras. Comprometemo-nos a discipular, equipar e enviar pessoas para fazer a diferença em suas
                comunidades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section id="lideranca" className="team-area team-section-extra-padding soft-blue-bg">
        <div className="container">
          <div className="section-title text-center mb-50">
            <h2 className="title">Nossa Liderança</h2>
          </div>
          <div className="row team-members">
            {loading ? (
              <div className="col-12 text-center">
                <p>Carregando líderes...</p>
              </div>
            ) : leaders.length > 0 ? (
              leaders.map((leader) => (
                <div key={leader.id} className="col-lg-4 col-md-6">
                  <div className="team-member-three mb-30">
                    <div className="member-inner">
                      <img src={leader.image || '/images/team1.png'} alt={leader.name} />
                      <div className="team-content">
                        <h5 className="name">{leader.name}</h5>
                        <span className="position">{leader.position || 'Líder'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>Nenhum líder encontrado.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About

