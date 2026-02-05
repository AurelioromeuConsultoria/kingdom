import { Link } from 'react-router-dom';
import '../../styles/shared-pages.css';
import './Servos.css';

function Servos() {
  return (
    <div className="servos-page">
      {/* Page Title */}
      <section className="page-title-area">
        <div className="container">
          <h2 className="title">Servos</h2>
          <ul className="breadcrumb-nav">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li className="active">Servos</li>
          </ul>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="section-pad-top-bottom">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-md-10">
              <div className="servos-content">
                <div className="intro-section mb-50">
                  <p className="subtitle-text">A maturidade do pertencimento</p>
                  <p className="lead-text">
                    Servo não é quem faz mais.<br />
                    É quem vive alinhado.
                  </p>
                </div>

                <div className="main-content mb-50">
                  <p>
                    O servo já pertence.<br />
                    Compreende a visão.<br />
                    Carrega a mentalidade.<br />
                    E manifesta, de forma consistente, a vida de Cristo.
                  </p>
                  
                  <p>
                    Seu serviço não nasce da obrigação, mas da revelação.<br />
                    Ele serve porque entende quem é e a quem pertence.
                  </p>
                  
                  <p>
                    O servo não busca posição.<br />
                    Não negocia caráter.<br />
                    Não serve por reconhecimento.
                  </p>
                  
                  <p>
                    Ele entende que servir é expressão de maturidade espiritual, emocional e relacional.
                  </p>
                </div>

                <div className="honor-section">
                  <h3 className="section-subtitle">O servo honra a igreja quando:</h3>
                  <ul className="honor-list">
                    <li>Vive a visão com constância, dentro e fora dos ambientes visíveis</li>
                    <li>Serve com excelência, dignidade e responsabilidade</li>
                    <li>Presta contas com maturidade e verdade</li>
                    <li>Reconhece cada conquista como memorial do que Deus já fez</li>
                    <li>Escolhe amar, perdoar e gerar ambientes saudáveis</li>
                  </ul>
                </div>

                <div className="conclusion-section mt-50">
                  <p className="conclusion-text">
                    Servo não surge por imposição.<br />
                    Servo é formado ao longo do caminho.
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

export default Servos;
