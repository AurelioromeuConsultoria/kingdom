import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import apiService from '../../services/api.service'

function Ministries() {
  const [ministries, setMinistries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMinistries()
  }, [])

  const loadMinistries = async () => {
    try {
      const data = await apiService.getMinistries()
      setMinistries(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Erro ao carregar ministérios:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ministries-page">
      <section className="page-title-area">
        <div className="container">
          <h2 className="title">Nossos Ministérios</h2>
          <ul className="breadcrumb-nav">
            <li>
              <a href="/">Home</a>
            </li>
            <li className="active">Ministérios</li>
          </ul>
        </div>
      </section>

      <section className="service-section section-gap">
        <div className="main-container">
          <div className="row">
            {loading ? (
              <div className="col-12 text-center">
                <p>Carregando ministérios...</p>
              </div>
            ) : ministries.length > 0 ? (
              ministries.map((ministry) => (
                <div key={ministry.id} className="col-lg-4 col-md-6 mb-30">
                  <div className="service-item-four">
                    <div className="services-thumb">
                      <img src={ministry.image || '/images/youth.png'} alt={ministry.name} />
                    </div>
                    <div className="services-content">
                      <h4 className="title">
                        <Link to={`/ministerios/${ministry.id}`}>{ministry.name}</Link>
                      </h4>
                      <p>{ministry.description}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>Nenhum ministério encontrado.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Ministries

