import { Link } from 'react-router-dom'
import '../../styles/shared-pages.css'
import './About.css'

function About() {

  return (
    <div className="about-page">
      {/* Page Title */}
      <section className="page-title-area">
        <div className="container">
          <h2 className="title">Sobre Nós</h2>
          <ul className="breadcrumb-nav">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li className="active">Sobre</li>
          </ul>
        </div>
      </section>

      {/* SOBRE NÓS — QUEM SOMOS */}
      <section id="quem-somos" className="section-pad-top-bottom">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-md-10">
              <div className="section-title text-center mb-40">
                <h2 className="title">QUEM SOMOS</h2>
              </div>
              <div className="about-content" style={{ textAlign: 'left' }}>
                <p>
                  Somos uma comunidade cristocêntrica e orgânica, formada por pessoas que desejam manifestar Cristo na vida comum.
                </p>
                <h4>
                  Promovemos conexões reais — com Cristo, com a fé e com a comunidade.
                </h4>
                <p>
                  Aqui, homens e mulheres caminham juntos sob o governo de CRISTO JESUS
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOSSA ESSÊNCIA */}
      <section id="essencia" className="section-pad-top-bottom soft-blue-bg">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-md-10">
              <div className="section-title text-center mb-40">
                <h2 className="title">NOSSA ESSÊNCIA</h2>
              </div>
              <div className="about-content" style={{ textAlign: 'left' }}>
                <p className="destaque">
                  Vivemos três verdades que moldam tudo o que somos:
                </p>
                <ul>
                  <li>
                    <span>●</span>
                    Cristo é o centro
                  </li>
                  <li>
                    <span>●</span>
                    O Reino é nossa cultura
                  </li>
                  <li>
                    <span>●</span>
                    A fé que resiste é nossa marca
                  </li>
                </ul>
                <h4>
                  Somos KINGDOM – uma comunidade governada pelo Rei.
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOSSA MISSÃO */}
      <section id="missao" className="section-pad-top-bottom">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-md-10">
              <div className="section-title text-center mb-40">
                <h2 className="title">NOSSA MISSÃO</h2>
                <p className="referencia-biblica">
                  MATEUS 24v14
                </p>
              </div>
              <div className="about-content" style={{ textAlign: 'left' }}>
                <p className="texto-missao">
                  Expressar o Evangelho do Reino não apenas com palavras, mas com uma vida que revela:
                </p>
                <ul className="missao">
                  <li>
                    <span>●</span>
                    o governo de Cristo
                  </li>
                  <li>
                    <span>●</span>
                    Sua graça
                  </li>
                  <li>
                    <span>●</span>
                    Sua presença
                  </li>
                  <li>
                    <span>●</span>
                    Sua autoridade
                  </li>
                </ul>
                <h4>
                  Nossa missão é simples: manifestar o Rei onde vivemos.
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOSSA IDENTIDADE */}
      <section id="identidade" className="section-pad-top-bottom soft-blue-bg">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-md-10">
              <div className="section-title text-center mb-40">
                <h2 className="title">NOSSA IDENTIDADE</h2>
              </div>
              <div className="about-content" style={{ textAlign: 'left' }}>
                <h4 style={{ marginBottom: '20px' }}>
                  KINGDOM significa REINO.
                </h4>
                <p>
                  É o nome que carrega nossa verdade: somos discípulos que vivem sob o governo de Cristo e expressam Sua cultura no mundo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOSSOS SÍMBOLOS */}
      <section id="simbolos" className="section-pad-top-bottom">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-md-10">
              <div className="section-title text-center mb-40">
                <h2 className="title">NOSSOS SÍMBOLOS</h2>
              </div>
              <div className="about-content" style={{ textAlign: 'left' }}>
                <div className="mb-30">
                  <h4>O Peixe – Fé que Resiste</h4>
                  <p>
                    Símbolo cristão mais antigo, usado pela igreja primitiva.
                  </p>
                  <p>
                    Representa coragem, fidelidade e a fé que permanece.
                  </p>
                </div>
                <div className="mb-30">
                  <h4>A Coroa – O Governo do Rei</h4>
                  <p>
                    Afirma que Cristo é nosso Rei, nossa autoridade e nosso modelo de vida.
                  </p>
                </div>
                <div>
                  <h4>O Logo KINGDOM</h4>
                  <p className="texto-simbolos">
                    A união do peixe e da coroa declara: <strong>"Seguimos o Rei com a fé que resiste."</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOSSA CULTURA */}
      <section id="cultura" className="section-pad-top-bottom soft-blue-bg">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-md-10">
              <div className="section-title text-center mb-40">
                <h2 className="title">NOSSA CULTURA</h2>
              </div>
              <div className="about-content" style={{ textAlign: 'left' }}>
                <p className="texto-cultura">
                  Nossa cultura é simples e profunda:
                </p>
                <div className="cultura-grande" style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                  <span style={{ color: '#994B22' }}>EU SIRVO</span>
                  <i className="fa-solid fa-arrow-right" style={{ fontSize: '20px', color: '#994B22' }}></i>
                  <span style={{ color: '#994B22' }}>EU CREIO</span>
                  <i className="fa-solid fa-arrow-right" style={{ fontSize: '20px', color: '#994B22' }}></i>
                  <span style={{ color: '#994B22' }}>EU PERTENÇO</span>
                </div>
                <div className="cultura-texto" style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                  <span>Servimos como Cristo.</span>
                  <i className="fa-solid fa-arrow-right" style={{ fontSize: '16px' }}></i>
                  <span>Cremos no Rei e no Seu Reino.</span>
                  <i className="fa-solid fa-arrow-right" style={{ fontSize: '16px' }}></i>
                  <span>Pertencemos a uma comunidade que vive a fé na prática.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOMOS KINGDOM */}
      <section id="somos-kingdom" className="section-pad-top-bottom">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-md-10">
              <div className="section-title text-center mb-40">
                <h2 className="title">SOMOS KINGDOM</h2>
              </div>
              <div className="about-content" style={{ textAlign: 'left' }}>
                <p className="texto-kingdom">
                  Uma comunidade do Reino.
                </p>
                <p className="texto-kingdom">
                  Família espiritual.
                </p>
                <p className="texto-kingdom">
                  Discípulos do Rei.
                </p>
                <p className="texto-kingdom">
                  Gente comum vivendo o Evangelho de forma extraordinária.
                </p>
                <p className="texto-kingdom">
                  Cristo é o Rei.
                </p>
                <p className="texto-kingdom">
                  O Reino é a nossa cultura.
                </p>
                <p className="texto-kingdom">
                  E a fé que resiste é a nossa marca.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default About
