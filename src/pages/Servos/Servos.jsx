import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../services/api.service';
import SEO from '../../components/SEO/SEO';
import '../../styles/shared-pages.css';
import './Servos.css';

function Servos() {
  const [churchInfo, setChurchInfo] = useState(null);

  useEffect(() => {
    const loadChurchInfo = async () => {
      try {
        const info = await apiService.getChurchInfo();
        setChurchInfo(info);
      } catch (error) {
        console.error('Erro ao carregar informações da igreja:', error);
      }
    };
    loadChurchInfo();
  }, []);

  const formatWhatsAppLink = (phone) => {
    if (!phone) return 'https://wa.me/5511947934943';
    const numbers = String(phone).replace(/\D/g, '');
    const phoneNumber = numbers.startsWith('55') ? numbers : `55${numbers}`;
    return `https://wa.me/${phoneNumber}`;
  };
  return (
    <div className="servos-page">
      <SEO
        title="Servos"
        description="Servos da Kingdom em Guarulhos. Conheça a visão de serviço e como nos dedicamos à comunidade e ao Reino."
        path="/servos"
      />
      {/* Page Title */}
      <section className="page-title-area">
        <div className="container">
          <h1 className="title">Servos</h1>
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

                <div className="cta-section mt-50">
                  <Link to="/servos/equipes" className="cta-link">
                    Conheça nossas equipes
                  </Link>
                  <a
                    href={formatWhatsAppLink(churchInfo?.contact?.phone || '11947934943')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-cta-link"
                  >
                    <i className="fa-brands fa-whatsapp"></i>
                    Quer se tornar um servo? Clique aqui
                  </a>
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
