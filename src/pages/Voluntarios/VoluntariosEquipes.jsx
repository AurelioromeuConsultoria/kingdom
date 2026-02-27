import { Link } from 'react-router-dom';
import '../../styles/shared-pages.css';
import './Voluntarios.css';
import './VoluntariosEquipes.css';

function VoluntariosEquipes() {
  return (
    <div className="voluntarios-equipes-page">
      {/* Page Title */}
      <section className="page-title-area">
        <div className="container">
          <h2 className="title">Equipes</h2>
          <ul className="breadcrumb-nav">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/voluntarios">Voluntariado</Link>
            </li>
            <li className="active">Equipes</li>
          </ul>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="section-pad-top-bottom">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-md-10">
              <div className="voluntarios-equipes-content">
                <div className="teams-grid">
                  {/* Parking */}
                  <div className="team-card mb-50">
                    <h3 className="team-title">Parking</h3>
                    <p className="team-description">
                      Primeiro contato de quem chega à Kingdom. Recebemos com cordialidade, organizamos o fluxo de veículos e direcionamos cada pessoa com clareza e atenção.
                    </p>
                  </div>

                  {/* Limpeza */}
                  <div className="team-card mb-50">
                    <h3 className="team-title">Limpeza</h3>
                    <p className="team-description">
                      Zela pela organização e higiene dos ambientes, preparando cada espaço com cuidado, honra e excelência.
                    </p>
                  </div>

                  {/* Manutenção */}
                  <div className="team-card mb-50">
                    <h3 className="team-title">Manutenção</h3>
                    <p className="team-description">
                      Cuida da estrutura física da Kingdom, garantindo segurança, organização e bom funcionamento dos espaços.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default VoluntariosEquipes;
