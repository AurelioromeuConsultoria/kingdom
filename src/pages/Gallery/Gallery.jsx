import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import apiService from '../../services/api.service'
import SEO from '../../components/SEO/SEO'
import '../../styles/shared-pages.css'
import './Gallery.css'

function Gallery() {
  const navigate = useNavigate()
  const [galerias, setGalerias] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoriaFiltro, setCategoriaFiltro] = useState('')
  const [busca, setBusca] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 6

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    setPaginaAtual(1) // Resetar página ao mudar filtros
  }, [categoriaFiltro, busca])

  const loadData = async () => {
    try {
      setLoading(true)
      const [galeriasData, categoriasData] = await Promise.all([
        apiService.getGaleriasAtivas(),
        apiService.getCategoriasMidias()
      ])
      setGalerias(Array.isArray(galeriasData) ? galeriasData : [])
      setCategorias(Array.isArray(categoriasData) ? categoriasData : [])
    } catch (error) {
      console.error('Erro ao carregar galerias:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar galerias
  const galeriasFiltradas = galerias.filter((galeria) => {
    const matchCategoria = !categoriaFiltro || galeria.categoriaMidiaId === parseInt(categoriaFiltro)
    const matchBusca = !busca || 
      galeria.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (galeria.descricao && galeria.descricao.toLowerCase().includes(busca.toLowerCase()))
    return matchCategoria && matchBusca
  })

  // Paginação
  const totalPaginas = Math.ceil(galeriasFiltradas.length / itensPorPagina)
  const inicio = (paginaAtual - 1) * itensPorPagina
  const fim = inicio + itensPorPagina
  const galeriasPagina = galeriasFiltradas.slice(inicio, fim)

  const handleGaleriaClick = (id) => {
    navigate(`/galeria/${id}`)
  }

  const handlePaginaChange = (novaPagina) => {
    setPaginaAtual(novaPagina)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const baseURL = apiService.getUploadsBaseUrl()

  return (
    <div className="gallery-page">
      <SEO
        title="Galeria de Fotos"
        description="Galeria de fotos dos eventos e momentos da Kingdom em Guarulhos. Cultos, encontros e atividades da igreja."
        path="/galeria"
      />
      <section className="page-title-area">
        <div className="container">
          <h1 className="title">Galeria de Fotos</h1>
          <ul className="breadcrumb-nav">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li className="active">Galeria</li>
          </ul>
        </div>
      </section>

      <section className="experience-section section-gap">
        <div className="container">
          {/* Filtros */}
          <div className="row mb-40">
            <div className="col-lg-6 col-md-6 mb-3">
              <div className="galeria-filtro">
                <label htmlFor="busca" className="sr-only">Buscar</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fa-solid fa-search"></i>
                  </span>
                  <input
                    type="text"
                    id="busca"
                    className="form-control"
                    placeholder="Buscar galerias..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 mb-3">
              <div className="galeria-filtro">
                <label htmlFor="categoria" className="sr-only">Categoria</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fa-solid fa-filter"></i>
                  </span>
                  <select
                    id="categoria"
                    className="form-control"
                    value={categoriaFiltro}
                    onChange={(e) => setCategoriaFiltro(e.target.value)}
                  >
                    <option value="">Todas as categorias</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de galerias */}
          {loading ? (
            <div className="row">
              <div className="col-12 text-center">
                <p>Carregando galerias...</p>
              </div>
            </div>
          ) : galeriasPagina.length > 0 ? (
            <>
              <div className="row justify-content-center mt-50">
                {galeriasPagina.map((galeria, index) => {
                  const imagemUrl = galeria.imagemDestaque
                    ? `${baseURL}/${galeria.imagemDestaque}`
                    : null
                  
                  return (
                    <div
                      key={galeria.id}
                      className="col-lg-4 col-md-6 col-sm-8 wow fadeInUp"
                      data-wow-delay={`${(index % 3) * 0.1}s`}
                    >
                      <div 
                        className="feature-box mt-30"
                        onClick={() => handleGaleriaClick(galeria.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        {imagemUrl ? (
                          <img
                            className="img-fluid"
                            src={imagemUrl}
                            alt={galeria.nome}
                            loading="lazy"
                          />
                        ) : (
                          <div className="galeria-placeholder">
                            <i className="fa-solid fa-images"></i>
                          </div>
                        )}
                        <div className="feature-overlay">
                          <div className="content">
                            <h5 className="title">{galeria.nome}</h5>
                            {galeria.descricao && (
                              <p>{galeria.descricao.substring(0, 80)}...</p>
                            )}
                            <div className="galeria-meta-overlay">
                              {galeria.data && (
                                <span>
                                  <i className="fa-solid fa-calendar"></i>{' '}
                                  {new Date(galeria.data).toLocaleDateString('pt-BR')}
                                </span>
                              )}
                              <span>
                                <i className="fa-solid fa-images"></i> {galeria.quantidadeFotos} fotos
                              </span>
                            </div>
                            <a 
                              href={`/galeria/${galeria.id}`}
                              onClick={(e) => {
                                e.preventDefault()
                                handleGaleriaClick(galeria.id)
                              }}
                            >
                              Ver Fotos
                            </a>
                            <i className="fas fa-images"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

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
                      // Mostrar apenas algumas páginas ao redor da atual
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

              {/* Mensagem quando não há resultados */}
              {galeriasFiltradas.length === 0 && (
                <div className="row">
                  <div className="col-12 text-center">
                    <p>Nenhuma galeria encontrada com os filtros selecionados.</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="row">
              <div className="col-12 text-center">
                <p>Nenhuma galeria encontrada.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Gallery
