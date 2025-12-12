/**
 * Traduz mensagens de validação HTML5 nativas do navegador para português
 */
export function setupValidationTranslations() {
  // Intercepta mensagens de validação HTML5
  document.addEventListener('invalid', (e) => {
    const input = e.target
    
    // Remove mensagem padrão
    input.setCustomValidity('')
    
    // Define mensagem customizada em português baseada no tipo de campo
    if (input.validity.valueMissing) {
      input.setCustomValidity('Por favor, preencha este campo.')
    } else if (input.validity.typeMismatch) {
      if (input.type === 'email') {
        input.setCustomValidity('Por favor, insira um endereço de email válido.')
      } else if (input.type === 'url') {
        input.setCustomValidity('Por favor, insira uma URL válida.')
      } else {
        input.setCustomValidity('Por favor, insira um valor válido.')
      }
    } else if (input.validity.patternMismatch) {
      input.setCustomValidity('Por favor, insira um valor no formato correto.')
    } else if (input.validity.tooShort) {
      input.setCustomValidity(`Por favor, insira pelo menos ${input.minLength} caracteres.`)
    } else if (input.validity.tooLong) {
      input.setCustomValidity(`Por favor, insira no máximo ${input.maxLength} caracteres.`)
    } else if (input.validity.rangeUnderflow) {
      input.setCustomValidity(`Por favor, insira um valor maior ou igual a ${input.min}.`)
    } else if (input.validity.rangeOverflow) {
      input.setCustomValidity(`Por favor, insira um valor menor ou igual a ${input.max}.`)
    } else if (input.validity.stepMismatch) {
      input.setCustomValidity(`Por favor, insira um valor válido.`)
    } else {
      input.setCustomValidity('Por favor, preencha este campo corretamente.')
    }
  }, true)
  
  // Limpa mensagem customizada quando o usuário começa a digitar
  document.addEventListener('input', (e) => {
    if (e.target.validity.valid) {
      e.target.setCustomValidity('')
    }
  })
  
  // Traduz mensagens de validação de formulários
  const forms = document.querySelectorAll('form')
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const invalidInputs = form.querySelectorAll(':invalid')
      if (invalidInputs.length > 0) {
        invalidInputs[0].focus()
      }
    })
  })
}

