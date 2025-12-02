/**
 * Script para gerar favicon.ico a partir do logo.png
 * 
 * Instale as dependências necessárias:
 * npm install --save-dev sharp
 * 
 * Execute: node scripts/generate-favicon.js
 */

import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync, mkdirSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const logoPath = join(__dirname, '../public/images/logo.png')
const faviconPath = join(__dirname, '../public/favicon.ico')

async function generateFavicon() {
  try {
    // Verificar se o logo existe
    if (!existsSync(logoPath)) {
      console.error('❌ Arquivo logo.png não encontrado em:', logoPath)
      process.exit(1)
    }

    console.log('🔄 Gerando favicon.ico a partir do logo.png...')

    // Converter PNG para ICO (16x16, 32x32, 48x48)
    // Nota: sharp não suporta ICO diretamente, então vamos criar um PNG de 32x32
    // e depois você pode usar uma ferramenta online para converter para ICO
    // ou usar o PNG como favicon (navegadores modernos aceitam PNG)
    
    await sharp(logoPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(join(__dirname, '../public/favicon-32x32.png'))

    await sharp(logoPath)
      .resize(16, 16, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(join(__dirname, '../public/favicon-16x16.png'))

    console.log('✅ Favicons gerados com sucesso!')
    console.log('📁 Arquivos criados:')
    console.log('   - public/favicon-16x16.png')
    console.log('   - public/favicon-32x32.png')
    console.log('')
    console.log('💡 Nota: Para gerar um arquivo .ico, você pode:')
    console.log('   1. Usar uma ferramenta online como https://convertio.co/pt/png-ico/')
    console.log('   2. Ou usar o PNG diretamente (navegadores modernos aceitam PNG como favicon)')
    
  } catch (error) {
    console.error('❌ Erro ao gerar favicon:', error.message)
    process.exit(1)
  }
}

generateFavicon()



