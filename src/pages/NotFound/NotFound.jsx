import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="not-found-page">
      <section className="page-title-area">
        <div className="container">
          <h2 className="title">404 - Página Não Encontrada</h2>
        </div>
      </section>
      <section className="section-gap">
        <div className="container text-center">
          <h1>404</h1>
          <p>A página que você está procurando não foi encontrada.</p>
          <Link to="/" className="main-btn mt-20">
            Voltar para Home
          </Link>
        </div>
      </section>
    </div>
  )
}

export default NotFound



