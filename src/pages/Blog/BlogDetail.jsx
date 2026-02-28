import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import apiService from '../../services/api.service'
import '../../styles/shared-pages.css'
import './Blog.css'

function BlogDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [noticia, setNoticia] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNoticia()
  }, [id])

  const loadNoticia = async () => {
    try {
      setLoading(true)
      const data = await apiService.getNoticiaById(id)
      // Mapear campos do DTO para o formato esperado
      setNoticia({
        id: data.id,
        title: data.titulo,
        description: data.descricao,
        text: data.texto,
        date: data.data || data.dataCriacao,
        image: data.imagem,
        url: data.url,
        categoryId: data.categoriaNoticiaId,
        categoryName: data.categoriaNoticiaNome,
        author: 'Admin' // Pode ser ajustado se houver campo de autor no DTO
      })
    } catch (error) {
      console.error('Erro ao carregar notícia:', error)
      if (error.response?.status === 404) {
        navigate('/noticias')
      }
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      return dateString
    }
  }

  const getImageUrl = (imagem) => {
    if (!imagem) return '/images/truth.png'
    return apiService.getImageUrl(imagem) || '/images/truth.png'
  }

  if (loading) {
    return (
      <div className="blog-page">
        <section className="page-title-area">
          <div className="container">
            <h2 className="title">Carregando...</h2>
          </div>
        </section>
        <section className="section-gap">
          <div className="container">
            <div className="text-center">
              <p>Carregando notícia...</p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (!noticia) {
    return (
      <div className="blog-page">
        <section className="page-title-area">
          <div className="container">
            <h2 className="title">Notícia não encontrada</h2>
          </div>
        </section>
        <section className="section-gap">
          <div className="container">
            <div className="text-center">
              <p>A notícia solicitada não foi encontrada.</p>
              <Link to="/noticias" className="main-btn mt-30">
                Voltar para Notícias
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="blog-page">
      <section className="page-title-area">
        <div className="container">
          <h2 className="title">Notícias</h2>
          <ul className="breadcrumb-nav">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li className="active">Notícias</li>
          </ul>
        </div>
      </section>

      <section className="latest-news section-gap">
        <div className="main-container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <article className="blog-detail">
                {noticia.image && (
                  <div className="post-thumb mb-30">
                    <img
                      className="img-fluid"
                      src={getImageUrl(noticia.image)}
                      alt={noticia.title}
                    />
                  </div>
                )}
                
                <div className="post-content">
                  <ul className="post-meta mb-20">
                    <li>
                      <i className="fa-solid fa-calendar-days"></i> {formatDate(noticia.date)}
                    </li>
                    {noticia.categoryName && (
                      <li>
                        <i className="fa-solid fa-tag"></i> {noticia.categoryName}
                      </li>
                    )}
                  </ul>

                  <h1 className="title mb-20">{noticia.title}</h1>

                  {noticia.description && (
                    <p className="lead mb-30">{noticia.description}</p>
                  )}

                  {noticia.text && (
                    <div
                      className="post-text"
                      dangerouslySetInnerHTML={{ __html: noticia.text }}
                    />
                  )}

                  {noticia.url && (
                    <div className="mt-30">
                      <a
                        href={noticia.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="main-btn"
                      >
                        Ler na fonte original <i className="fa-solid fa-external-link"></i>
                      </a>
                    </div>
                  )}

                  <div className="post-footer mt-50">
                    <Link to="/noticias" className="main-btn">
                      <i className="fa-solid fa-arrow-left"></i> Voltar para Notícias
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BlogDetail
