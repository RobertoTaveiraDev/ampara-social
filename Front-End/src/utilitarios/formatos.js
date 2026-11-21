export function somenteDigitos(texto) {
  return texto.replace(/\D/g, '')
}

export function formatarCpf(valor) {
  return somenteDigitos(valor)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export function formatarTelefone(valor) {
  const digitos = somenteDigitos(valor).slice(0, 11)

  if (digitos.length <= 10) {
    return digitos.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d{1,4})$/, '$1-$2')
  }

  return digitos.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
}

export function formatarData(dataIso) {
  const [ano, mes, dia] = dataIso.slice(0, 10).split('-')

  return `${dia}/${mes}/${ano}`
}

export function formatarMoeda(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
