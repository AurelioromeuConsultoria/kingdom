/**
 * Inicialização dos plugins jQuery do template
 * Estes plugins são necessários para funcionalidades como sliders, menus, etc.
 */

export function initializeTemplatePlugins() {
  // Aguardar jQuery estar disponível
  if (typeof window.jQuery === 'undefined') {
    // Carregar jQuery se não estiver disponível
    const script = document.createElement('script')
    script.src = '/assets/js/jquery-1.12.4.min.js'
    script.onload = () => {
      loadTemplatePlugins()
    }
    document.head.appendChild(script)
  } else {
    loadTemplatePlugins()
  }
}

function loadTemplatePlugins() {
  const $ = window.jQuery

  // Carregar scripts necessários
  const scripts = [
    '/assets/js/bootstrap.bundle.min.js',
    '/assets/js/slick.min.js',
    '/assets/js/jquery.magnific-popup.min.js',
    '/assets/js/isotope.pkgd.min.js',
    '/assets/js/imagesloaded.pkgd.min.js',
    '/assets/js/jquery.inview.min.js',
    '/assets/js/jquery.easypiechart.min.js',
    '/assets/js/jquery.syotimer.min.js',
    '/assets/js/wow.min.js',
    '/assets/js/main.js'
  ]

  let loadedCount = 0

  scripts.forEach((src, index) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => {
      loadedCount++
      if (loadedCount === scripts.length) {
        // Todos os scripts carregados
        initializePlugins($)
      }
    }
    script.onerror = () => {
      console.warn(`Falha ao carregar script: ${src}`)
      loadedCount++
      if (loadedCount === scripts.length) {
        initializePlugins($)
      }
    }
    document.body.appendChild(script)
  })
}

function initializePlugins($) {
  // Inicializar plugins quando necessário
  // A maioria já é inicializada automaticamente pelo main.js do template
  
  // Inicializar WOW.js para animações
  if (typeof window.WOW !== 'undefined') {
    new window.WOW().init()
  }

  // Menu mobile (já inicializado pelo main.js, mas podemos garantir)
  $(document).ready(function() {
    // Menu toggle já está no main.js do template
    console.log('Plugins do template inicializados')
  })
}

