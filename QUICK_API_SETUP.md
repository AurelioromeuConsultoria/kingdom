# 🚀 Configuração Rápida da API

## Passo a Passo

### 1. Criar arquivo `.env.local`

Na pasta `site/`, crie um arquivo chamado `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:7000/api
```

**⚠️ IMPORTANTE:** Ajuste a porta conforme sua API .NET:
- Porta 7000: `http://localhost:7000/api`
- Porta 5001: `http://localhost:5001/api`
- Porta 7000: `http://localhost:7000/api`

### 2. Configurar CORS na API .NET

No seu `Program.cs` ou `Startup.cs` da API .NET:

```csharp
// Permitir requisições do frontend React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// No pipeline (antes de UseAuthorization)
app.UseCors("AllowReactApp");
```

### 3. Reiniciar o servidor React

```bash
# Parar o servidor (Ctrl + C)
npm run dev
```

### 4. Testar

1. Certifique-se de que a API .NET está rodando
2. Abra o site em `http://localhost:3000`
3. Abra o Console do navegador (F12)
4. Verifique se não há erros de CORS ou conexão

## ✅ Checklist

- [ ] Arquivo `.env.local` criado com a URL correta da API
- [ ] CORS configurado na API .NET
- [ ] API .NET está rodando
- [ ] Servidor React reiniciado após criar `.env.local`
- [ ] Sem erros no console do navegador

## 🐛 Problemas Comuns

### "Network Error" ou "CORS Error"
→ Verifique se o CORS está configurado na API .NET

### "404 Not Found"
→ Verifique se a URL no `.env.local` está correta
→ Verifique se a API está rodando na porta correta

### Dados não aparecem
→ Verifique o console do navegador para erros
→ Verifique se os endpoints da API retornam dados no formato esperado

## 📚 Mais Informações

Veja o arquivo `API_CONFIGURACAO.md` para documentação completa.


