import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';
import '../../styles/shared-pages.css';
import './Servos.css';
import './Equipes.css';

function Equipes() {
  return (
    <div className="equipes-page">
      <SEO
        title="Equipes - Hospitalidade e Serviço"
        description="Equipes de serviço da Kingdom: Hospitalidade, Parking, Limpeza. Conheça como nos organizamos para acolher em Guarulhos."
        path="/servos/equipes"
      />
      {/* Page Title */}
      <section className="page-title-area">
        <div className="container">
          <h2 className="title">Equipes</h2>
          <ul className="breadcrumb-nav">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/servos">Servos</Link>
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
              <div className="equipes-content">
                <div className="intro-section mb-50">
                  <p className="lead-text">
                    Nossa organização sustenta nossa visão.<br />
                    Tornamo-nos a transformação que desejamos ver.
                  </p>
                </div>

                <div className="teams-grid">
                  {/* Hospitalidade */}
                  <div className="team-card mb-50">
                    <h3 className="team-title">Hospitalidade</h3>
                    <p className="team-description">
                      Criamos conexões genuínas logo na chegada. Servimos com alegria, acolhimento e atenção, preparando um ambiente leve e intencional.
                    </p>
                  </div>

                  {/* Front Lobby */}
                  <div className="team-card mb-50">
                    <h3 className="team-title">Front Lobby</h3>
                    <p className="team-description">
                      Expressamos, desde a entrada, que todos podem chegar como são. Acolhemos com alegria, promovendo conexões e direcionando cada pessoa com cuidado.
                    </p>
                  </div>

                  {/* Recepção Auditório */}
                  <div className="team-card mb-50">
                    <h3 className="team-title">Recepção Auditório</h3>
                    <p className="team-description">
                      Garantimos que a experiência no auditório seja organizada, fluida e acolhedora, orientando entradas, saídas e cuidando de cada detalhe do ambiente.
                    </p>
                  </div>

                  {/* Next Step */}
                  <div className="team-card mb-50">
                    <h3 className="team-title">Next Step</h3>
                    <p className="team-description">
                      Conectamos pessoas aos próximos passos na Kingdom. Orientamos, realizamos inscrições e ajudamos cada um a se envolver na comunidade.
                    </p>
                  </div>

                  {/* Produção */}
                  <div className="team-section team-section-no-border mb-50">
                    <h3 className="team-section-title">Produção</h3>
                    <div className="team-sub-items">
                      <div className="team-sub-item">
                        <h4 className="team-sub-title">Projeção</h4>
                        <p>Responsável pela condução visual da reunião, exibindo letras, versículos e comunicados com clareza e sincronização.</p>
                      </div>
                      <div className="team-sub-item">
                        <h4 className="team-sub-title">Áudio</h4>
                        <p>Cuida de todo o sistema de som, garantindo qualidade técnica e excelência na experiência sonora.</p>
                      </div>
                      <div className="team-sub-item">
                        <h4 className="team-sub-title">Transições</h4>
                        <p>Coordena a movimentação e a dinâmica entre os momentos da reunião com organização e fluidez.</p>
                      </div>
                      <div className="team-sub-item">
                        <h4 className="team-sub-title">Produtores</h4>
                        <p>Planejam e estruturam cada reunião, alinhando equipes e garantindo que tudo aconteça com excelência.</p>
                      </div>
                      <div className="team-sub-item">
                        <h4 className="team-sub-title">Iluminação</h4>
                        <p>Opera e ajusta os recursos de luz, contribuindo para a atmosfera e identidade visual de cada encontro.</p>
                      </div>
                    </div>
                  </div>

                  {/* Creative */}
                  <div className="team-section mb-50">
                    <h3 className="team-section-title">Creative</h3>
                    <div className="team-sub-items">
                      <div className="team-sub-item">
                        <h4 className="team-sub-title">Video</h4>
                        <p>Produz e edita conteúdos que comunicam a visão da Kingdom com criatividade e excelência.</p>
                      </div>
                      <div className="team-sub-item">
                        <h4 className="team-sub-title">Photo</h4>
                        <p>Registra momentos importantes e preserva a identidade visual através das imagens.</p>
                      </div>
                      <div className="team-sub-item">
                        <h4 className="team-sub-title">Artes</h4>
                        <p>Desenvolve artes para eventos e conteúdos digitais, garantindo unidade estética em toda comunicação.</p>
                      </div>
                    </div>
                  </div>

                  {/* Kids */}
                  <div className="team-card mb-50">
                    <h3 className="team-title">Kids</h3>
                    <p className="team-description">
                      Conduz crianças em seu crescimento espiritual, oferecendo um ambiente seguro, estruturado e alinhado à visão da Kingdom.
                    </p>
                  </div>

                  {/* Connect */}
                  <div className="team-card mb-50">
                    <h3 className="team-title">Connect</h3>
                    <p className="team-description">
                      Acompanha e orienta pessoas durante a semana, mantendo contato, organizando inscrições e facilitando o envolvimento na comunidade.
                    </p>
                  </div>

                  {/* Pastoral Care */}
                  <div className="team-card mb-50">
                    <h3 className="team-title">Pastoral Care</h3>
                    <p className="team-description">
                      Serve e apoia pastores e ministradores com zelo e discrição, garantindo que estejam amparados em cada reunião.
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

export default Equipes;
