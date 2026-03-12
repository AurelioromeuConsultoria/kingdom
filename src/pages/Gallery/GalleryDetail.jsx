import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import apiService from '../../services/api.service'
import Lightbox from '../../components/Lightbox/Lightbox'
import SEO from '../../components/SEO/SEO'
import '../../styles/shared-pages.css'
import './Gallery.css'

function GalleryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [galeria, setGaleria] = useState(null)
  const [fotos, setFotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [fotoSelecionada, setFotoSelecionada] = useState(null)

  useEffect(() => {
    loadGaleria()
  }, [id])

  const loadGaleria = async () => {
    try {
      setLoading(true)
      const [galeriaData, fotosData] = await Promise.all([
        apiService.getGaleriaById(id),
        apiService.getFotosByGaleria(id)
      ])
      setGaleria(galeriaData)
      setFotos(Array.isArray(fotosData) ? fotosData : [])
    } catch (error) {
      console.error('Erro ao carregar galeria:', error)
      if (error.response?.status === 404) {
        navigate('/galeria')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFotoClick = (index) => {
    setFotoSelecionada(index)
  }

  const handleCloseLightbox = () => {
    setFotoSelecionada(null)
  }

  const handleAnterior = () => {
    setFotoSelecionada((prev) => (prev > 0 ? prev - 1 : fotos.length - 1))
  }

  const handleProxima = () => {
    setFotoSelecionada((prev) => (prev < fotos.length - 1 ? prev + 1 : 0))
  }

  if (loading) {
    return (
      <div className="gallery-page">
        <section className="page-title-area">
          <div className="container">
            <h2 className="title">Carregando...</h2>
          </div>
        </section>
        <section className="section-gap">
          <div className="container">
            <div className="text-center">
              <p>Carregando galeria...</p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (!galeria) {
    return (
      <div className="gallery-page">
        <section className="page-title-area">
          <div className="container">
            <h2 className="title">Galeria não encontrada</h2>
          </div>
        </section>
        <section className="section-gap">
          <div className="container">
            <div className="text-center">
              <p>A galeria solicitada não foi encontrada.</p>
              <button onClick={() => navigate('/galeria')} className="btn btn-primary mt-3">
                Voltar para Galerias
              </button>
            </div>
          </div>
        </section>
      </div>
    )
  }

  const baseURL = apiService.getUploadsBaseUrl()

  return (
    <div className="gallery-page">
      <SEO
        title={galeria.nome}
        description={galeria.descricao || `Galeria de fotos: ${galeria.nome}. Kingdom em Guarulhos.`}
        path={`/galeria/${id}`}
      />
      <section className="page-title-area">
        <div className="container">
          <h2 className="title">{galeria.nome}</h2>
          <ul className="breadcrumb-nav">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/galeria">Galeria</Link>
            </li>
            <li className="active">{galeria.nome}</li>
          </ul>
        </div>
      </section>

      <section className="experience-section section-gap">
        <div className="container">
          {/* Informações da galeria */}
          <div className="row mb-40">
            <div className="col-12">
              <div className="galeria-info">
                {galeria.descricao && (
                  <p className="galeria-descricao">{galeria.descricao}</p>
                )}
                <div className="galeria-meta">
                  {galeria.data && (
                    <span>
                      <i className="fa-solid fa-calendar"></i>{' '}
                      {new Date(galeria.data).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                  {galeria.categoriaMidiaNome && (
                    <span>
                      <i className="fa-solid fa-tag"></i> {galeria.categoriaMidiaNome}
                    </span>
                  )}
                  {galeria.eventoTitulo && (
                    <span>
                      <i className="fa-solid fa-calendar-check"></i> {galeria.eventoTitulo}
                    </span>
                  )}
                  <span>
                    <i className="fa-solid fa-images"></i> {galeria.quantidadeFotos} fotos
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de fotos */}
          {fotos.length > 0 ? (
            <div className="row justify-content-center mt-50">
              {fotos.map((foto, index) => {
                const thumbnailUrl = `${baseURL}/${galeria.caminhoDiretorio}/thumbnail/${foto.nomeArquivo}`
                return (
                  <div
                    key={foto.nomeArquivo}
                    className="col-lg-6 col-md-6 col-sm-8 wow fadeInUp"
                    data-wow-delay={`${(index % 4) * 0.1}s`}
                  >
                    <div className="photogallery">
                      <img
                        src={thumbnailUrl}
                        alt={foto.nomeArquivo}
                        className="img-fluid"
                        onClick={() => handleFotoClick(index)}
                        style={{ cursor: 'pointer' }}
                        loading="lazy"
                      />
                      {foto.destaque && (
                        <div className="foto-destaque-badge">
                          <i className="fa-solid fa-star"></i>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="row">
              <div className="col-12 text-center">
                <p>Esta galeria ainda não possui fotos.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {fotoSelecionada !== null && fotos[fotoSelecionada] && (
        <Lightbox
          foto={fotos[fotoSelecionada]}
          galeria={galeria}
          totalFotos={fotos.length}
          fotoAtual={fotoSelecionada}
          onClose={handleCloseLightbox}
          onAnterior={handleAnterior}
          onProxima={handleProxima}
        />
      )}
    </div>
  )
}

export default GalleryDetail

