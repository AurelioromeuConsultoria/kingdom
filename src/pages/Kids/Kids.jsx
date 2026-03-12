import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';
import '../../styles/shared-pages.css';
import './Kids.css';

function Kids() {
  return (
    <div className="kids-page">
      <SEO
        title="Kids - Ministério Infantil"
        description="Ministério infantil Kings Kids na Kingdom em Guarulhos. Formação espiritual e desenvolvimento do caráter cristão das crianças."
        path="/kids"
      />
      {/* Page Title */}
      <section className="page-title-area">
        <div className="container">
          <h1 className="title">Kids</h1>
          <ul className="breadcrumb-nav">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li className="active">Kids</li>
          </ul>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="section-pad-top-bottom">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-md-10">
              <div className="kids-content">
                {/* Introdução */}
                <div className="intro-section mb-50">
                  <h3 className="section-title">Introdução</h3>
                  <p>
                    O Kings Kids é o ministério infantil voltado à formação espiritual e ao desenvolvimento do caráter cristão das crianças, fundamentado na Palavra de Deus e na centralidade de Cristo.
                  </p>
                  <p>
                    Por meio de atividades lúdicas intencionais, o ministério coopera na construção de uma identidade firmada em Cristo, promovendo discernimento espiritual, maturidade emocional e princípios sólidos desde a infância.
                  </p>
                  <p>
                    Cremos que investir na formação interior das crianças hoje é cooperar para uma sociedade mais íntegra, consciente e alinhada aos valores do Reino de Deus.
                  </p>
                </div>

                {/* Galeria de fotos */}
                <div className="kids-photos-section mb-50">
                  <div className="kids-photos-grid">
                    <div className="kids-photo-item">
                      <img src="/images/kids-oracao.png" alt="Crianças em momento de oração e reflexão" className="kids-photo" loading="lazy" />
                    </div>
                    <div className="kids-photo-item">
                      <img src="/images/kids-biblia.png" alt="Crianças lendo a Bíblia em atividade do Kings Kids" className="kids-photo" loading="lazy" />
                    </div>
                  </div>
                </div>

                {/* Nossa Visão */}
                <div className="vision-section mb-50">
                  <h3 className="section-title">Nossa Visão</h3>
                  <p>
                    O Kings Kids é o ministério infantil dedicado a cooperar na formação da natureza de Cristo nas crianças, para que cresçam com o coração alinhado ao evangelho genuíno.
                  </p>
                  <p>
                    Cremos que a vida cristã não se resume a comportamentos externos, mas nasce de uma identidade firmada em Cristo. Por isso, desde cedo, conduzimos as crianças a compreender verdades espirituais que muitos levam anos para discernir.
                  </p>
                </div>

                {/* Nossa Missão */}
                <div className="mission-section mb-50">
                  <h3 className="section-title">Nossa Missão</h3>
                  <p>
                    Cada atividade, dinâmica e brincadeira é intencional. Nada é aleatório.
                  </p>
                  <p>
                    Entendemos que o ambiente lúdico também é um campo de formação espiritual, onde verdades eternas são semeadas de forma simples, clara e profunda. Todas as experiências propostas têm como objetivo fortalecer a identidade, a consciência espiritual e o caráter das crianças.
                  </p>
                  <p>
                    Trabalhamos para prepará-las a enfrentar, com discernimento e firmeza, os desafios dos ambientes escolares, sociais e, futuramente, profissionais, mantendo uma fé viva e uma identidade preservada em Cristo.
                  </p>
                </div>

                {/* Nosso Propósito */}
                <div className="purpose-section mb-50">
                  <h3 className="section-title">Nosso Propósito</h3>
                  <p>
                    Compreendemos que a formação do caráter hoje impacta diretamente a sociedade de amanhã. Ao cooperarmos com Deus na edificação interior dessas crianças, cremos que contribuímos para o surgimento de uma geração mais justa, íntegra e consciente de quem é em Cristo.
                  </p>
                  <p>
                    Não formamos apenas crianças bem-comportadas. Formamos filhos que conhecem o Filho.
                  </p>
                  <p>
                    Crianças que aprendem, desde cedo, a ouvir a voz de Deus, a discernir a verdade e a caminhar firmadas naquilo que é eterno.
                  </p>
                </div>

                {/* Nossa Responsabilidade */}
                <div className="responsibility-section mb-50">
                  <h3 className="section-title">Nossa Responsabilidade</h3>
                  <p>
                    Cremos que essa geração nos foi confiada por Deus. Nossa missão é clara: apresentar Jesus, guardar o coração das crianças e cooperar para que cresçam com raízes profundas, fé amadurecida e identidade fortalecida, para a glória de Deus e para o bem das próximas gerações.
                  </p>
                </div>

                {/* Nossos Valores */}
                <div className="values-section">
                  <h3 className="section-title">Nossos Valores</h3>
                  
                  <div className="value-item mb-40">
                    <h4 className="value-title">Cristo como centro</h4>
                    <p>
                      Tudo começa e termina em Cristo. Nosso maior valor é formar a natureza de Jesus no coração das crianças. Não ensinamos apenas histórias bíblicas, cooperamos para que Cristo seja revelado, conhecido e vivido desde a infância.
                    </p>
                  </div>

                  <div className="value-item mb-40">
                    <h4 className="value-title">Identidade antes do comportamento</h4>
                    <p>
                      Cremos que transformação verdadeira nasce da identidade. Antes de corrigir atitudes, formamos convicções. Antes de exigir comportamento, apresentamos quem elas são em Cristo. O fruto vem como consequência de raízes bem formadas.
                    </p>
                  </div>

                  <div className="value-item mb-40">
                    <h4 className="value-title">Crianças são a Igreja de hoje</h4>
                    <p>
                      Não tratamos crianças como "a igreja de amanhã". Elas são a Igreja que está sendo formada hoje e líderes que estão sendo preparados para amanhã. Honramos a infância sem infantilizar a fé.
                    </p>
                  </div>

                  <div className="value-item mb-40">
                    <h4 className="value-title">Liderança que começa no coração</h4>
                    <p>
                      Formamos líderes antes de formar funções. Liderança, para nós, é caráter, responsabilidade, serviço e discernimento espiritual. A liderança começa no coração alinhado a Deus.
                    </p>
                  </div>

                  <div className="value-item mb-40">
                    <h4 className="value-title">Ambiente intencional</h4>
                    <p>
                      Nada é aleatório. Cada atividade, brincadeira e dinâmica é pensada como instrumento de formação espiritual. O ambiente lúdico é usado com propósito, verdade e direção.
                    </p>
                  </div>

                  <div className="value-item mb-40">
                    <h4 className="value-title">Verdade comunicada com simplicidade</h4>
                    <p>
                      Acreditamos que verdades profundas podem ser ensinadas de forma simples. Falamos a linguagem da criança sem diluir o evangelho. Simplicidade não é superficialidade.
                    </p>
                  </div>

                  <div className="value-item mb-40">
                    <h4 className="value-title">Cuidado com o coração</h4>
                    <p>
                      Guardamos o coração das crianças. Valorizamos o cuidado emocional, espiritual e relacional, criando um ambiente seguro, saudável e cheio da presença de Deus.
                    </p>
                  </div>

                  <div className="value-item">
                    <h4 className="value-title">Cooperação com a família</h4>
                    <p>
                      Entendemos que a formação espiritual não acontece isoladamente. Caminhamos junto com os pais e responsáveis, cooperando para uma criação alinhada à fé, ao caráter e à identidade em Cristo.
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

export default Kids;
