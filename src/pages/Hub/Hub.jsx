import { Link } from 'react-router-dom'
import SEO from '../../components/SEO/SEO'
import '../../styles/shared-pages.css'
import './Hub.css'

function Hub() {
  return (
    <div className="hub-page">
      <SEO
        title="HuB Kingdom - Casas de Comunhão"
        description="HuB Kingdom: estratégia missionária em casas. Conectando pessoas e estabelecendo o Reino em Guarulhos através de células e comunhão."
        path="/hub"
      />
      <section className="page-title-area">
        <div className="container">
          <h1 className="title">HuB Kingdom</h1>
          <ul className="breadcrumb-nav">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li className="active">HuB Kingdom</li>
          </ul>
        </div>
      </section>

      <section className="section-pad-top-bottom">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-md-10">
              <div className="hub-content">
                {/* Hero / Tagline */}
                <div className="hub-intro mb-50">
                  <p className="hub-tagline">
                    Conectando pessoas. Estabelecendo o Reino.
                  </p>
                  <p>
                    O HuB Kingdom é uma estratégia missionária baseada no modelo bíblico de Lucas 10, onde Jesus enviou seus discípulos de dois em dois para preparar o caminho do Reino de Deus nas cidades e casas.
                  </p>
                  <p>
                    Nossa visão é simples e poderosa: levar a presença de Deus para dentro das casas, formando ambientes onde pessoas podem experimentar fé, relacionamento e transformação.
                  </p>
                  <p>
                    Cada HuB é um ponto vivo do Reino — um espaço de comunhão, oração, discipulado e cuidado.
                  </p>
                  <div className="hub-photo hub-photo--feature">
                    <img src="/images/hub1.png" alt="Encontro HuB: pessoas reunidas em casa em comunhão e estudo" loading="lazy" />
                  </div>
                </div>

                {/* Base bíblica */}
                <div className="hub-section mb-50">
                  <h3 className="section-title">A base bíblica da visão</h3>
                  <p>
                    O HuB nasce da prática ensinada por Jesus:
                  </p>
                  <blockquote className="hub-verse">
                    “Depois disso, o Senhor designou outros setenta e os enviou de dois em dois adiante de si a todas as cidades e lugares para onde ele estava para ir.”<br />
                    <cite>Lucas 10:1</cite>
                  </blockquote>
                  <p>
                    Assim como os discípulos foram enviados para encontrar “filhos da paz”, nós também somos enviados para encontrar pessoas abertas a receber Deus em seus lares.
                  </p>
                  <p>
                    O objetivo não é criar eventos religiosos, mas ambientes vivos onde Deus pode agir na vida das famílias.
                  </p>
                  <div className="hub-photo">
                    <img src="/images/hub2.png" alt="Grupo em casa: compartilhando a Palavra e construindo relacionamentos" loading="lazy" />
                  </div>
                </div>

                {/* O que é um HuB */}
                <div className="hub-section mb-50">
                  <h3 className="section-title">O que é um HuB?</h3>
                  <p>
                    O HuB Kingdom é um encontro simples que acontece em uma casa, com o propósito de:
                  </p>
                  <ul className="hub-list">
                    <li>compartilhar a Palavra de Deus</li>
                    <li>orar pelas necessidades das pessoas</li>
                    <li>construir relacionamentos verdadeiros</li>
                    <li>cuidar da vida espiritual das famílias</li>
                    <li>expandir o Reino de Deus na cidade</li>
                  </ul>
                  <p>
                    Cada casa aberta se torna uma embaixada do Reino de Deus.
                  </p>
                  <div className="hub-photos-grid">
                    <div className="hub-photo">
                      <img src="/images/hub3.png" alt="Encontro simples em casa: comunhão e discipulado" loading="lazy" />
                    </div>
                    <div className="hub-photo">
                      <img src="/images/hub4.png" alt="HuB: oração, Palavra e cuidado em ambiente acolhedor" loading="lazy" />
                    </div>
                  </div>
                </div>

                {/* Visão que transforma cidades */}
                <div className="hub-section mb-50">
                  <h3 className="section-title">Uma visão que transforma cidades</h3>
                  <p>
                    Cada casa aberta para o HuB representa algo poderoso:
                  </p>
                  <ul className="hub-list">
                    <li>uma família alcançada</li>
                    <li>um território espiritual restaurado</li>
                    <li>uma nova comunidade sendo formada</li>
                  </ul>
                  <p>
                    Quando muitas casas se tornam HuBs, vemos surgir uma rede viva de discipulado e cuidado espalhada pela cidade.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Hub
