import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/shared-pages.css'
import './Leadership.css'

function Leadership() {
  // Dados estáticos dos líderes
  const allLeaders = [
    {
      id: 1,
      name: 'Ap. Sandro Lopez',
      position: 'Apóstolo',
      image: '/images/team1.png',
      slug: 'sandro-lopez'
    },
    {
      id: 2,
      name: 'Bp. Marta Silva',
      position: 'Bispa',
      image: '/images/team2.png',
      slug: 'marta-silva'
    },
    {
      id: 3,
      name: 'Pr. Ednei Silva',
      position: 'Pastor',
      image: '/images/team3.png',
      slug: 'ednei-silva'
    }
  ]

  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 6

  // Paginação
  const totalPaginas = Math.ceil(allLeaders.length / itensPorPagina)
  const inicio = (paginaAtual - 1) * itensPorPagina
  const fim = inicio + itensPorPagina
  const leadersPagina = allLeaders.slice(inicio, fim)

  const handlePaginaChange = (novaPagina) => {
    setPaginaAtual(novaPagina)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="leadership-page">
      {/* Page Title */}
      <section className="page-title-area">
        <div className="container">
          <h2 className="title">Nossa Liderança</h2>
          <ul className="breadcrumb-nav">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li className="active">Nossa Liderança</li>
          </ul>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-area team-section-extra-padding soft-blue-bg">
        <div className="container">
          <div className="row team-members">
            {leadersPagina.map((leader) => (
              <div key={leader.id} className="col-lg-4 col-md-6">
                <div className="team-member-three mb-30">
                  <div className="member-inner">
                    <img src={leader.image} alt={leader.name} />
                    <div className="team-content">
                      <h5 className="name">
                        <Link to={`/lideranca/${leader.slug}`}>{leader.name}</Link>
                      </h5>
                      <span className="position">{leader.position}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Paginação */}
            {totalPaginas > 1 && (
              <div className="col-lg-12 col-md-12 col-sm-12">
                <ul className="page-pagination blog-pagination mt-50">
                  <li>
                    <button
                      className={`prev page-numbers ${paginaAtual === 1 ? 'disabled' : ''}`}
                      onClick={() => paginaAtual > 1 && handlePaginaChange(paginaAtual - 1)}
                      disabled={paginaAtual === 1}
                    >
                      <i className="fa-solid fa-arrow-left"></i>
                    </button>
                  </li>

                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => {
                    if (
                      pagina === 1 ||
                      pagina === totalPaginas ||
                      (pagina >= paginaAtual - 1 && pagina <= paginaAtual + 1)
                    ) {
                      return (
                        <li key={pagina}>
                          <button
                            className={`page-numbers ${pagina === paginaAtual ? 'current' : ''}`}
                            onClick={() => handlePaginaChange(pagina)}
                          >
                            {pagina}
                          </button>
                        </li>
                      )
                    } else if (pagina === paginaAtual - 2 || pagina === paginaAtual + 2) {
                      return (
                        <li key={pagina}>
                          <span className="page-numbers">...</span>
                        </li>
                      )
                    }
                    return null
                  })}

                  <li>
                    <button
                      className={`next page-numbers ${paginaAtual === totalPaginas ? 'disabled' : ''}`}
                      onClick={() => paginaAtual < totalPaginas && handlePaginaChange(paginaAtual + 1)}
                      disabled={paginaAtual === totalPaginas}
                    >
                      <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Leadership

