import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import apiService from '../../services/api.service'
import '../../styles/shared-pages.css'

function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const data = await apiService.getNoticias()
      // Mapear campos do DTO para o formato esperado pela página
      const mappedPosts = Array.isArray(data) ? data.map(noticia => ({
        id: noticia.id,
        title: noticia.titulo,
        description: noticia.descricao,
        excerpt: noticia.descricao,
        text: noticia.texto,
        date: noticia.data || noticia.dataCriacao,
        image: noticia.imagem,
        url: noticia.url,
        categoryId: noticia.categoriaNoticiaId,
        categoryName: noticia.categoriaNoticiaNome,
        author: 'Admin' // Pode ser ajustado se houver campo de autor no DTO
      })) : []
      setPosts(mappedPosts)
    } catch (error) {
      console.error('Erro ao carregar notícias:', error)
      setPosts([])
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
            {loading ? (
              <div className="col-12 text-center">
                <p>Carregando notícias...</p>
              </div>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="col-lg-4 col-md-6 col-sm-8 mb-30">
                  <div className="latest-news-box">
                    <div className="post-thumb">
                      <img className="img-fluid" src={getImageUrl(post.image)} alt={post.title} />
                    </div>
                    <div className="post-content">
                      <ul className="post-meta">
                        <li>
                          <i className="fa-solid fa-calendar-days"></i> {formatDate(post.date)}
                        </li>
                        {post.categoryName && (
                          <li>
                            <i className="fa-solid fa-tag"></i> {post.categoryName}
                          </li>
                        )}
                      </ul>
                      <h4 className="title">
                        <Link to={`/noticias/${post.id}`}>{post.title}</Link>
                      </h4>
                      <p>{post.description || post.excerpt}</p>
                      <Link to={`/noticias/${post.id}`} className="read-more-btn">
                        Ler Mais <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>Nenhuma notícia encontrada.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Blog

