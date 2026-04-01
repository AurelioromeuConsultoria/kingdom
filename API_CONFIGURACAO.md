# 🔌 Configuração da API .NET

Este documento explica como configurar a integração com a API .NET que roda em localhost.

## 📋 Pré-requisitos

1. API .NET rodando em localhost (ex: `http://localhost:7000`)
2. CORS configurado na API .NET para permitir requisições do frontend

## ⚙️ Configuração

### 1. Criar arquivo `.env.local`

Na raiz do projeto `site/`, crie um arquivo `.env.local` com o seguinte conteúdo:

```env
# URL base da API .NET rodando em localhost
VITE_API_BASE_URL=http://localhost:7000/api
```

**Importante:** Ajuste a porta conforme sua API .NET:
- Se sua API roda na porta 7000: `http://localhost:7000/api`
- Se sua API roda na porta 5001: `http://localhost:5001/api`
- Se sua API roda na porta 7000: `http://localhost:7000/api`

### 2. Configurar CORS na API .NET

Sua API .NET precisa permitir requisições do frontend. No `Program.cs` ou `Startup.cs`:

```csharp
// Exemplo para .NET 6+
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Porta do Vite
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// No pipeline
app.UseCors("AllowReactApp");
```

### 3. Reiniciar o servidor de desenvolvimento

Após criar o arquivo `.env.local`, reinicie o servidor:

```bash
# Parar o servidor (Ctrl + C)
# Iniciar novamente
npm run dev
```

## 🔍 Verificação

Para verificar se a configuração está funcionando:

1. Abra o Console do navegador (F12)
2. Vá para a aba "Network"
3. Recarregue a página
4. Procure por requisições para `/api/...`
5. Verifique se não há erros de CORS

## 📡 Endpoints Utilizados

A aplicação faz requisições para os seguintes endpoints:

### Informações da Igreja
- `GET /api/church/info` - Informações gerais da igreja

### Eventos
- `GET /api/events/upcoming?limit=3` - Próximos eventos
- `GET /api/events` - Todos os eventos
- `GET /api/events/{id}` - Detalhes de um evento

### Ministérios
- `GET /api/ministries` - Lista de ministérios
- `GET /api/ministries/{id}` - Detalhes de um ministério

### Notícias/Blog
- `GET /api/posts?limit=3` - Últimas notícias
- `GET /api/posts` - Todas as notícias
- `GET /api/posts/{id}` - Detalhes de uma notícia

### Sermões
- `GET /api/sermons` - Lista de sermões
- `GET /api/sermons/{id}` - Detalhes de um sermão

### Contato
- `POST /api/contact` - Enviar mensagem de contato
- `POST /api/contact/prayer` - Enviar pedido de oração

### Galeria
- `GET /api/gallery/photos` - Fotos da galeria
- `GET /api/gallery/videos` - Vídeos da galeria

## 🐛 Troubleshooting

### Erro de CORS

Se você ver erros de CORS no console:
- Verifique se o CORS está configurado na API .NET
- Verifique se a porta do frontend (3000) está permitida no CORS
- Verifique se a URL da API está correta no `.env.local`

### Erro 404 (Not Found)

- Verifique se a API está rodando
- Verifique se a URL no `.env.local` está correta
- Verifique se os endpoints existem na API

### Erro de conexão

- Verifique se a API .NET está rodando
- Verifique se a porta está correta
- Tente acessar a URL da API diretamente no navegador

## 📝 Formato de Resposta Esperado

A API deve retornar dados no formato JSON. Exemplos:

### Evento
```json
{
  "id": 1,
  "title": "Conferência de Liderança",
  "description": "Descrição do evento...",
  "date": "2023-03-17T00:00:00",
  "image": "/images/event.jpg"
}
```

### Ministério
```json
{
  "id": 1,
  "name": "Ministério de Jovens",
  "description": "Descrição do ministério...",
  "image": "/images/youth.png"
}
```

### Post/Notícia
```json
{
  "id": 1,
  "title": "Título da Notícia",
  "description": "Descrição...",
  "date": "2023-01-11T00:00:00",
  "author": "Admin",
  "image": "/images/news.jpg"
}
```

## 🔐 Autenticação (Opcional)

Se sua API requer autenticação, você pode adicionar tokens no `api.service.js`:

```javascript
// No interceptor de requisições
const token = localStorage.getItem('token')
if (token) {
  config.headers.Authorization = `Bearer ${token}`
}
```


