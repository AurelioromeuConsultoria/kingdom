import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import apiService from '../../services/api.service'

function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const data = await apiService.getPosts()
      setPosts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Erro ao carregar notícias:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="blog-page">
      <section className="page-title-area">
        <div className="container">
          <h2 className="title">Notícias</h2>
          <ul className="breadcrumb-nav">
            <li>
              <a href="/">Home</a>
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
                      <img className="img-fluid" src={post.image || '/images/truth.png'} alt={post.title} />
                    </div>
                    <div className="post-content">
                      <ul className="post-meta">
                        <li>
                          <i className="fa-solid fa-user"></i> {post.author || 'Admin'}
                        </li>
                        <li>
                          <i className="fa-solid fa-calendar-days"></i> {formatDate(post.date)}
                        </li>
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

