# 🚀 Deploy para Azure Static Web Apps

Este guia explica como configurar e fazer deploy do portal para Azure Static Web Apps.

## 📋 Pré-requisitos

- Conta no Azure com uma Static Web App criada
- Repositório no GitHub ou Azure DevOps
- Token de API da Static Web App (obtido no portal Azure)

## 🔑 Obter o Token de API

1. Acesse o [Portal Azure](https://portal.azure.com)
2. Navegue até sua **Static Web App**
3. No menu lateral, clique em **"Manage deployment token"**
4. Copie o token exibido (você precisará dele nas próximas etapas)

## 🔧 Opção 1: GitHub Actions (Recomendado)

### Passo 1: Configurar o Secret no GitHub

1. Acesse seu repositório no GitHub
2. Vá em **Settings** → **Secrets and variables** → **Actions**
3. Clique em **New repository secret**
4. Nome: `AZURE_STATIC_WEB_APPS_API_TOKEN`
5. Valor: Cole o token obtido no portal Azure
6. Clique em **Add secret**

### Passo 2: Configurar a Branch

A pipeline está configurada para executar em:
- **main** ou **master** (push e pull requests)

Se sua branch principal tiver outro nome, edite o arquivo `.github/workflows/azure-static-web-apps.yml`:

```yaml
on:
  push:
    branches:
      - sua-branch-principal
```

### Passo 3: Fazer Push

A pipeline será executada automaticamente quando você fizer push para a branch principal:

```bash
git add .
git commit -m "Configurar pipeline Azure SWA"
git push origin main
```

### Passo 4: Verificar o Deploy

1. Acesse a aba **Actions** no GitHub
2. Clique na execução da pipeline para ver os logs
3. Após o sucesso, acesse sua Static Web App no Azure

## 🔧 Opção 2: Azure DevOps

### Passo 1: Criar a Pipeline

1. Acesse seu projeto no Azure DevOps
2. Vá em **Pipelines** → **New pipeline**
3. Selecione seu repositório (Azure Repos, GitHub, etc.)
4. Escolha **Existing Azure Pipelines YAML file**
5. Selecione o arquivo `azure-pipelines.yml` na branch principal
6. Clique em **Continue**

### Passo 2: Configurar a Variável

1. Na página de configuração da pipeline, clique em **Variables**
2. Clique em **New variable**
3. Nome: `AZURE_STATIC_WEB_APPS_API_TOKEN`
4. Valor: Cole o token obtido no portal Azure
5. Marque como **Secret**
6. Clique em **OK**

### Passo 3: Executar a Pipeline

1. Clique em **Save** e depois em **Run**
2. A pipeline será executada e fará o deploy automaticamente

## ⚙️ Configurações Adicionais

### Variáveis de Ambiente

Se você precisar configurar variáveis de ambiente (como a URL da API), edite os arquivos de pipeline:

**GitHub Actions** (`.github/workflows/azure-static-web-apps.yml`):
```yaml
- name: Build
  run: npm run build
  env:
    VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
```

**Azure DevOps** (`azure-pipelines.yml`):
```yaml
env:
  VITE_API_BASE_URL: $(VITE_API_BASE_URL)
```

E configure os secrets/variáveis correspondentes no GitHub ou Azure DevOps.

### Arquivo de Configuração

O arquivo `staticwebapp.config.json` já está configurado para:
- Redirecionar todas as rotas para `index.html` (SPA routing)
- Configurar cache para assets estáticos
- Definir tipos MIME corretos

Você pode editar este arquivo conforme necessário.

## 📝 Estrutura da Pipeline

A pipeline executa os seguintes passos:

1. **Checkout** do código
2. **Instalação** do Node.js
3. **Instalação** das dependências (`npm ci`)
4. **Build** do projeto (`npm run build`)
5. **Deploy** para Azure Static Web App

O diretório de saída (`dist/`) é automaticamente enviado para a Azure.

## 🔍 Troubleshooting

### Erro: "AZURE_STATIC_WEB_APPS_API_TOKEN not found"
- Verifique se o secret/variável está configurado corretamente
- Certifique-se de que o nome está exatamente como `AZURE_STATIC_WEB_APPS_API_TOKEN`

### Erro: "Build failed"
- Verifique os logs da pipeline para ver o erro específico
- Certifique-se de que todas as dependências estão no `package.json`
- Teste o build localmente: `npm run build`

### Site não carrega após o deploy
- Verifique se o arquivo `staticwebapp.config.json` está na raiz do projeto
- Verifique se o `index.html` está sendo gerado na pasta `dist/`
- Verifique os logs da Static Web App no portal Azure

### Rotas não funcionam (404)
- O arquivo `staticwebapp.config.json` já está configurado para SPA routing
- Se ainda houver problemas, verifique se o arquivo está na raiz do projeto

## 📚 Recursos Adicionais

- [Documentação Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/)
- [GitHub Actions para Azure SWA](https://github.com/Azure/static-web-apps-deploy)
- [Configuração de rotas](https://docs.microsoft.com/azure/static-web-apps/routes)

