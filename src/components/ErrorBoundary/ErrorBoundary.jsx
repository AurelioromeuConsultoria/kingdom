import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorCount: 0 }
    this.resetErrorBoundary = this.resetErrorBoundary.bind(this)
  }

  static getDerivedStateFromError(error) {
    // Filtrar erros que não devem quebrar a aplicação
    // Erros de removeChild podem ser ignorados se não afetarem a funcionalidade
    if (error?.message?.includes('removeChild') && error?.message?.includes('not a child')) {
      console.warn('Erro de removeChild ignorado pelo ErrorBoundary:', error)
      return null // Não atualizar o estado, ignorar o erro
    }
    
    // Atualiza o state para que a próxima renderização mostre a UI de fallback
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Filtrar erros que não devem quebrar a aplicação
    if (error?.message?.includes('removeChild') && error?.message?.includes('not a child')) {
      console.warn('Erro de removeChild ignorado:', error)
      return // Não registrar como erro crítico
    }
    
    // Você pode registrar o erro em um serviço de relatório de erros aqui
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo)
    
    // Incrementar contador de erros
    this.setState(prevState => ({
      errorCount: prevState.errorCount + 1
    }))
  }

  resetErrorBoundary() {
    this.setState({ hasError: false, error: null, errorCount: 0 })
  }

  render() {
    if (this.state.hasError) {
      // Você pode renderizar qualquer UI de fallback customizada
      return (
        <div style={{ 
          padding: '50px', 
          textAlign: 'center',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h1 style={{ color: '#994B22', marginBottom: '20px' }}>Ops! Algo deu errado</h1>
          <p style={{ marginBottom: '30px', color: '#666' }}>
            Ocorreu um erro ao carregar a página. Por favor, recarregue a página.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={this.resetErrorBoundary}
              style={{
                padding: '12px 24px',
                backgroundColor: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Tentar Novamente
            </button>
            <button
              onClick={() => {
                window.location.reload()
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: '#994B22',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Recarregar Página
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
