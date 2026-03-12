import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import apiService from '../../services/api.service'
import SEO from '../../components/SEO/SEO'
import '../../styles/shared-pages.css'

function Sermons() {
  const [sermons, setSermons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSermons()
  }, [])

  const loadSermons = async () => {
    try {
      const data = await apiService.getSermons()
      setSermons(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Erro ao carregar sermões:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sermons-page">
      <SEO
        title="Sermões e Mensagens"
        description="Assista aos sermões e mensagens da Kingdom em Guarulhos. Pregações, estudos bíblicos e conteúdo em vídeo."
        path="/sermoes"
      />
      <section className="page-title-area">
        <div className="container">
          <h1 className="title">Sermões</h1>
          <ul className="breadcrumb-nav">
            <li>
              <a href="/">Home</a>
            </li>
            <li className="active">Sermões</li>
          </ul>
        </div>
      </section>

      <section className="section-gap">
        <div className="main-container">
          <div className="row">
            {loading ? (
              <div className="col-12 text-center">
                <p>Carregando sermões...</p>
              </div>
            ) : sermons.length > 0 ? (
              sermons.map((sermon) => (
                <div key={sermon.id} className="col-lg-4 col-md-6 mb-30">
                  <div className="latest-news-box">
                    <div className="post-thumb">
                      <img className="img-fluid" src={sermon.image || '/images/sermon1.png'} alt={sermon.title} loading="lazy" />
                    </div>
                    <div className="post-content">
                      <h4 className="title">
                        <Link to={`/sermoes/${sermon.id}`}>{sermon.title}</Link>
                      </h4>
                      <p>{sermon.description}</p>
                      <Link to={`/sermoes/${sermon.id}`} className="read-more-btn">
                        Ouvir <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>Nenhum sermão encontrado.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Sermons

