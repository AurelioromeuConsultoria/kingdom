import { Link } from 'react-router-dom';
import '../../styles/shared-pages.css';
import './Voluntarios.css';

function Voluntarios() {
  return (
    <div className="voluntarios-page">
      {/* Page Title */}
      <section className="page-title-area">
        <div className="container">
          <h2 className="title">Voluntariado</h2>
          <ul className="breadcrumb-nav">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li className="active">Voluntariado</li>
          </ul>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="section-pad-top-bottom">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-md-10">
              <div className="voluntarios-content">
                <div className="intro-section mb-50">
                  <p className="subtitle-text">O início do caminho</p>
                  <p className="lead-text">
                    O voluntariado é o espaço onde a pessoa se aproxima para servir.
                  </p>
                </div>

                <div className="main-content mb-50">
                  <p>
                    Não é necessário compreender tudo.<br />
                    Não é exigido pertencimento imediato.<br />
                    Não é esperado que todas as respostas já existam.
                  </p>
                  
                  <p>
                    No voluntariado, o serviço vem primeiro.
                  </p>
                  
                  <p>
                    A pessoa serve.<br />
                    Servindo, passa a crer na cultura.<br />
                    Crendo, passa a pertencer.
                  </p>
                  
                  <p>
                    Aqui, o serviço antecede o crer e o pertencimento.
                  </p>
                  
                  <p>
                    O voluntário é integrado a uma equipe possível, clara e acessível. No exercício do servir, ele observa, aprende e experimenta. Nesse processo, a visão deixa de ser apenas apresentada e passa a ser vivida.
                  </p>
                  
                  <p>
                    Servir gera entendimento.<br />
                    O entendimento fortalece a fé.<br />
                    A fé conduz ao alinhamento.
                  </p>
                  
                  <p>
                    O voluntariado é um ambiente seguro de crescimento, onde valores são assimilados na prática, no convívio e na experiência diária, e não apenas explicados em palavras.
                  </p>
                </div>

                <div className="honor-section">
                  <h3 className="section-subtitle">O voluntário honra a igreja quando:</h3>
                  <ul className="honor-list">
                    <li>Caminha alinhado à visão, mesmo estando em processo de aprendizado</li>
                    <li>Serve a uma causa maior do que seus próprios interesses</li>
                    <li>Desenvolve transparência, responsabilidade e maturidade relacional</li>
                    <li>Celebra processos, crescimento e conquistas com gratidão</li>
                    <li>Mantém um coração ensinável, humilde e disponível</li>
                  </ul>
                </div>

                <div className="conclusion-section mt-50">
                  <p className="conclusion-text">
                    O voluntariado não é um rótulo.<br />
                    É um processo de formação
                  </p>
                  <p className="final-quote">
                    ***Impossível servir a Deus, sem se relacionar com pessoas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Voluntarios;
