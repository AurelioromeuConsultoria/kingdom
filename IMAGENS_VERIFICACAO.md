# Verificação de Imagens

## Status das Imagens

Todas as imagens necessárias foram copiadas do template para `site/public/images/`:

✅ **Imagens principais:**
- banner1.png, banner2.png, banner3.png
- about.png
- logo.png, logo-white.png
- youth.png, women.png, teen.png
- leadership.png, conference.png
- truth.png, cross.png, books.png
- team1.png, team2.png, team3.png
- sermon1.png, sermon3.png
- disciple.png, evengelism.png, lead.png
- favicon.png
- bulletin.pdf

✅ **Shapes decorativos:**
- /assets/img/shape/about-shape-01.png
- /assets/img/shape/about-shape-02.png
- /assets/img/shape/portfolio-shape.png

## Como as Imagens Funcionam no Vite

No Vite, arquivos na pasta `public/` são servidos na raiz do site. Portanto:
- `/images/logo.png` → `public/images/logo.png`
- `/assets/img/shape/about-shape-01.png` → `public/assets/img/shape/about-shape-01.png`

## Se as Imagens Estão Quebradas

1. **Verifique se o servidor está rodando:**
   ```bash
   cd site
   npm run dev
   ```

2. **Limpe o cache do navegador:**
   - Pressione `Ctrl + Shift + R` (Windows/Linux) ou `Cmd + Shift + R` (Mac)
   - Ou abra as DevTools (F12) → Network → marque "Disable cache"

3. **Verifique o console do navegador:**
   - Abra as DevTools (F12) → Console
   - Procure por erros 404 relacionados a imagens

4. **Verifique se os arquivos existem:**
   ```powershell
   # Verificar imagens
   Get-ChildItem site\public\images
   
   # Verificar shapes
   Get-ChildItem site\public\assets\img\shape
   ```

5. **Se ainda não funcionar, tente usar caminhos absolutos:**
   - Em vez de `/images/logo.png`, use `./images/logo.png` ou importe a imagem:
   ```jsx
   import logo from '/images/logo.png'
   <img src={logo} alt="logo" />
   ```

## Estrutura de Pastas

```
site/
├── public/
│   ├── images/          ← Todas as imagens de conteúdo
│   │   ├── logo.png
│   │   ├── banner1.png
│   │   └── ...
│   └── assets/
│       └── img/
│           ├── banner/
│           └── shape/   ← Shapes decorativos
```

## Notas

- As imagens são referenciadas com caminhos absolutos começando com `/`
- No Vite, isso funciona tanto em desenvolvimento quanto em produção
- Se você mover imagens para `src/assets/`, precisará importá-las explicitamente



