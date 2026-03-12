/**
 * Configuração central para SEO do portal.
 * Base URL canônica do site (produção).
 */
export const SITE_BASE_URL = 'https://www.kingdombr.com.br'
export const SITE_NAME = 'Kingdom'
export const DEFAULT_OG_IMAGE = `${SITE_BASE_URL}/images/banner1.png`

/**
 * Dados para JSON-LD Organization (igreja).
 * Endereço e contato alinhados à página de Contato.
 */
export const ORGANIZATION_JSONLD = {
  name: SITE_NAME,
  description: 'Igreja evangélica em Guarulhos. Comunidade cristocêntrica e orgânica, formada por pessoas que desejam manifestar Cristo na vida comum.',
  url: SITE_BASE_URL,
  logo: `${SITE_BASE_URL}/images/logo.png`,
  image: DEFAULT_OG_IMAGE,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Av. Monte Alegre, 894 - Cidade Soberana',
    addressLocality: 'Guarulhos',
    addressRegion: 'SP',
    postalCode: '07161-150',
    addressCountry: 'BR'
  },
  telephone: '+55-11-94793-4943',
  email: 'contato@kingdombr.com.br',
  sameAs: [
    'https://www.instagram.com/kingdom.gru',
    'https://www.facebook.com/kingdom.gru',
    'https://www.tiktok.com/@kingdom.reino',
    'https://www.youtube.com/c/REINOCHURCHGRU'
  ]
}
