# Script para adicionar o QR Code na pasta correta
# Execute este script após salvar a imagem do QR Code

$imagePath = "site\public\images\qrcode-generosidade.png"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ADICIONAR QR CODE - INSTRUÇÕES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Salve a imagem do QR Code que você anexou no chat" -ForegroundColor Yellow
Write-Host "2. Renomeie o arquivo para: qrcode-generosidade.png" -ForegroundColor Yellow
Write-Host "3. Coloque o arquivo nesta pasta:" -ForegroundColor Yellow
Write-Host "   $((Resolve-Path 'site\public\images').Path)" -ForegroundColor Green
Write-Host ""
Write-Host "O arquivo deve se chamar exatamente: qrcode-generosidade.png" -ForegroundColor White
Write-Host ""
Write-Host "Após adicionar a imagem, recarregue a página no navegador." -ForegroundColor Cyan
Write-Host ""

# Verificar se o arquivo existe
if (Test-Path $imagePath) {
    Write-Host "✓ QR Code encontrado!" -ForegroundColor Green
    Write-Host "  Arquivo: $imagePath" -ForegroundColor Green
} else {
    Write-Host "✗ QR Code não encontrado ainda." -ForegroundColor Red
    Write-Host "  Adicione o arquivo em: $imagePath" -ForegroundColor Yellow
}




