# Script PowerShell para gerar favicon a partir do logo
# Este script cria uma copia redimensionada do logo como favicon

$logoPath = "public\images\logo.png"
$faviconPath = "public\favicon.ico"
$favicon32Path = "public\favicon-32x32.png"
$favicon16Path = "public\favicon-16x16.png"

Write-Host "Gerando favicon a partir do logo..." -ForegroundColor Cyan

if (-not (Test-Path $logoPath)) {
    Write-Host "Arquivo logo.png nao encontrado em: $logoPath" -ForegroundColor Red
    exit 1
}

# Copiar o logo como favicon (solucao temporaria)
# Nota: Para gerar um verdadeiro .ico, voce precisara usar uma ferramenta online
# ou instalar uma biblioteca como ImageMagick

Write-Host "Instrucoes para gerar favicon.ico:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Opcao 1 - Usar ferramenta online (Recomendado):" -ForegroundColor Green
Write-Host "   1. Acesse: https://convertio.co/pt/png-ico/" -ForegroundColor White
Write-Host "   2. Faca upload do arquivo: $logoPath" -ForegroundColor White
Write-Host "   3. Baixe o favicon.ico gerado" -ForegroundColor White
Write-Host "   4. Coloque em: $faviconPath" -ForegroundColor White
Write-Host ""
Write-Host "Opcao 2 - Usar Node.js script:" -ForegroundColor Green
Write-Host "   1. npm install --save-dev sharp" -ForegroundColor White
Write-Host "   2. node scripts/generate-favicon.js" -ForegroundColor White
Write-Host ""
Write-Host "Opcao 3 - Usar PNG diretamente (navegadores modernos aceitam):" -ForegroundColor Green
Copy-Item $logoPath "public\favicon.png" -Force
Write-Host "   Logo copiado como favicon.png" -ForegroundColor Green
Write-Host "   (Atualize o index.html para usar /favicon.png)" -ForegroundColor Yellow

Write-Host ""
Write-Host "Processo concluido!" -ForegroundColor Green