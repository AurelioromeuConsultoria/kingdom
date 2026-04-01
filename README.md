# Site da Igreja - React + API .NET

Site institucional para igreja construído com React e integração com API .NET.

## 🚀 Tecnologias

- **React 18** - Biblioteca JavaScript para interfaces
- **React Router** - Roteamento
- **Axios** - Cliente HTTP para API
- **Vite** - Build tool moderna e rápida
- **Template CSS** - Estilos do template original

## 📁 Estrutura do Projeto

```
site/
├── public/              # Arquivos estáticos (assets, images)
│   ├── assets/         # CSS, JS e imagens do template
│   └── images/         # Imagens de conteúdo
├── src/
│   ├── components/     # Componentes React reutilizáveis
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── Layout/
│   ├── pages/          # Páginas da aplicação
│   │   ├── Home/
│   │   ├── About/
│   │   ├── Contact/
│   │   └── ...
│   ├── services/       # Serviços de API
│   │   ├── api.config.js
│   │   └── api.service.js
│   ├── utils/          # Utilitários
│   ├── hooks/          # Custom hooks
│   ├── App.jsx         # Componente principal
│   └── main.jsx        # Ponto de entrada
├── package.json
├── vite.config.js
└── .env.example
```

## 🛠️ Instalação

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure a URL da sua API .NET:

```env
VITE_API_BASE_URL=http://localhost:7000/api
```

### 3. Executar em desenvolvimento

```bash
npm run dev
```

O site estará disponível em `http://localhost:3000`

### 4. Build para produção

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`

## 🔌 Integração com API .NET

### Endpoints Esperados

A aplicação espera os seguintes endpoints na sua API .NET:

#### Eventos
- `GET /api/events` - Lista todos os eventos
- `GET /api/events/{id}` - Detalhes de um evento
- `GET /api/events/upcoming?limit={limit}` - Próximos eventos

#### Ministérios
- `GET /api/ministries` - Lista todos os ministérios
- `GET /api/ministries/{id}` - Detalhes de um ministério

#### Liderança
- `GET /api/leaders` - Lista todos os líderes
- `GET /api/leaders/{id}` - Detalhes de um líder

#### Sermões
- `GET /api/sermons` - Lista todos os sermões
- `GET /api/sermons/{id}` - Detalhes de um sermão

#### Notícias/Blog
- `GET /api/posts` - Lista todas as notícias
- `GET /api/posts/{id}` - Detalhes de uma notícia

#### Galeria
- `GET /api/gallery/photos` - Lista de fotos
- `GET /api/gallery/videos` - Lista de vídeos

#### Contato
- `POST /api/contact` - Enviar mensagem de contato
- `POST /api/contact/prayer` - Enviar pedido de oração

#### Informações da Igreja
- `GET /api/church/info` - Informações gerais da igreja

### Formato de Resposta Esperado

A API deve retornar dados no formato JSON. Exemplos:

#### Informações da Igreja
```json
{
  "name": "Kingdom",
  "description": "Descrição da igreja",
  "contact": {
    "email": "contato@kingdom.com",
    "phone": "+00 0000-0000",
    "address": "Endereço da Igreja Kingdom"
  },
  "socialMedia": {
    "facebook": "https://facebook.com/kingdom",
    "twitter": "https://twitter.com/kingdom",
    "instagram": "https://instagram.com/kingdom",
    "linkedin": "https://linkedin.com/kingdom",
    "youtube": "https://youtube.com/kingdom"
  }
}
```

#### Eventos
```json
[
  {
    "id": 1,
    "title": "Título do Evento",
    "description": "Descrição do evento",
    "date": "2024-01-15T10:00:00Z",
    "location": "Local do evento",
    "image": "url-da-imagem.jpg"
  }
]
```

## 📝 Desenvolvimento

### Adicionar Nova Página

1. Crie um componente em `src/pages/NovaPagina/NovaPagina.jsx`
2. Adicione a rota em `src/App.jsx`:

```jsx
<Route path="/nova-pagina" element={<NovaPagina />} />
```

### Adicionar Novo Componente

Crie o componente em `src/components/NovoComponente/NovoComponente.jsx`

### Usar API Service

```jsx
import apiService from '../services/api.service'

// Em um componente
const loadData = async () => {
  try {
    const data = await apiService.getEvents()
    console.log(data)
  } catch (error) {
    console.error('Error:', error)
  }
}
```

## 🎨 Estilos

Os estilos do template estão em `public/assets/css/`. Os componentes React usam as classes CSS do template original.

Para estilos específicos de componentes, crie arquivos `.css` junto com os componentes.

## 📦 Deploy

### Netlify

1. Conecte seu repositório
2. Configure o build command: `npm run build`
3. Configure o publish directory: `dist`
4. Adicione variáveis de ambiente se necessário

### Vercel

1. Conecte seu repositório
2. O Vercel detecta automaticamente o Vite
3. Configure variáveis de ambiente

### Servidor Tradicional

1. Execute `npm run build`
2. Faça upload da pasta `dist/` para seu servidor

## 🔧 Configuração da API

A URL da API é configurada em:

1. **Variável de ambiente**: `.env` (recomendado para desenvolvimento)
2. **Código**: `src/services/api.config.js` (fallback)

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação da API .NET ou entre em contato com a equipe de desenvolvimento.

## 📄 Licença

Este projeto utiliza um template base. Verifique a licença do template original.
