# 🚀 Como Rodar o Projeto no VS Code

## Passo a Passo

### 1️⃣ Abrir o Terminal no VS Code

- Pressione `Ctrl + '` (aspas simples) ou
- Menu: `Terminal` → `New Terminal` ou
- Menu: `View` → `Terminal`

### 2️⃣ Navegar até a pasta do projeto

No terminal, digite:

```bash
cd site
```

### 3️⃣ Instalar as dependências (primeira vez apenas)

```bash
npm install
```

⏱️ Isso pode levar alguns minutos na primeira vez.

### 4️⃣ Criar arquivo de configuração (opcional)

Crie um arquivo `.env` na pasta `site/` com:

```env
VITE_API_BASE_URL=http://localhost:7000/api
```

> **Nota:** Substitua pela URL da sua API .NET se for diferente.

### 5️⃣ Rodar o projeto

```bash
npm run dev
```

### 6️⃣ Acessar o site

O terminal mostrará algo como:

```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

Abra seu navegador em: **http://localhost:3000**

---

## 📝 Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `npm install` | Instala todas as dependências |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Cria build de produção |
| `npm run preview` | Visualiza o build de produção |
| `npm run lint` | Verifica erros de código |

---

## ⚠️ Problemas Comuns

### Erro: "npm não é reconhecido"
**Solução:** Instale o Node.js: https://nodejs.org/

### Erro: "Port 3000 is already in use"
**Solução:** 
- Feche outros programas usando a porta 3000, ou
- Altere a porta no arquivo `vite.config.js`

### Erro ao instalar dependências
**Solução:**
```bash
npm cache clean --force
npm install
```

### O site abre mas mostra erro
**Solução:** 
- Verifique se a API .NET está rodando
- Verifique o console do navegador (F12) para ver erros
- Verifique se o arquivo `.env` está configurado corretamente

---

## 🎯 Dica Rápida

Para rodar mais rápido no futuro, você pode:

1. **Criar um script de atalho** no VS Code:
   - Abra `package.json`
   - Os scripts já estão configurados!

2. **Usar o Terminal Integrado:**
   - O VS Code mantém o terminal aberto
   - Basta digitar `npm run dev` novamente

3. **Usar o Debugger:**
   - Pressione `F5` para iniciar com debug
   - (Precisa configurar o `launch.json` primeiro)

---

## 📚 Próximos Passos

Depois que o projeto estiver rodando:

1. ✅ Verifique se o site abre corretamente
2. ✅ Teste a navegação entre páginas
3. ✅ Configure a URL da API no `.env`
4. ✅ Teste a integração com a API .NET

---

**Boa sorte! 🎉**


