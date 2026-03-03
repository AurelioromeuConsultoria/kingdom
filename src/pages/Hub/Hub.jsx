import { Link } from 'react-router-dom'
import '../../styles/shared-pages.css'

function Hub() {
  return (
    <div className="hub-page">
      {/* Page Title */}
      <section className="page-title-area">
        <div className="container">
          <h2 className="title">Hub</h2>
          <ul className="breadcrumb-nav">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li className="active">Hub</li>
          </ul>
        </div>
      </section>

      {/* Conteúdo principal (placeholder) */}
      <section className="section-pad-top-bottom">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <p>
                Em breve você encontrará aqui mais informações sobre o Hub.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Hub

