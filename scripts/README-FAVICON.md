# Gerar Favicon a partir do Logo

## Opção 1: Usar Script Node.js (Recomendado)

1. Instale a dependência:
```bash
npm install --save-dev sharp
```

2. Execute o script:
```bash
node scripts/generate-favicon.js
```

Isso criará arquivos PNG de 16x16 e 32x32 pixels.

## Opção 2: Converter Online

1. Acesse: https://convertio.co/pt/png-ico/
2. Faça upload do arquivo `public/images/logo.png`
3. Baixe o arquivo `favicon.ico` gerado
4. Coloque em `public/favicon.ico`

## Opção 3: Usar PNG diretamente (Mais simples)

Navegadores modernos aceitam PNG como favicon. Você pode simplesmente:
1. Copiar `public/images/logo.png` para `public/favicon.png`
2. Atualizar o `index.html` para usar `favicon.png`

## Após gerar o favicon.ico

Certifique-se de que o `index.html` está configurado corretamente:
```html
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
```
