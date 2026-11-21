const enderecoDaApi = import.meta.env.VITE_API_URL

export class ErroDaApi extends Error {
  constructor(mensagem, status) {
    super(mensagem)
    this.status = status
  }
}

export async function requisitar(caminho, { metodo = 'GET', corpo } = {}) {
  const token = sessionStorage.getItem('token')
  const cabecalhos = { 'Content-Type': 'application/json' }

  if (token) {
    cabecalhos.Authorization = `Bearer ${token}`
  }

  const resposta = await fetch(`${enderecoDaApi}${caminho}`, {
    method: metodo,
    headers: cabecalhos,
    body: corpo ? JSON.stringify(corpo) : undefined,
  })

  if (resposta.status === 401 && token) {
    sessionStorage.removeItem('token')
    window.location.assign('/login')
  }

  if (resposta.status === 403) {
    window.location.assign('/acesso-negado')
  }

  const conteudo = await resposta.json()

  if (!resposta.ok) {
    throw new ErroDaApi(conteudo.mensagem, resposta.status)
  }

  return conteudo
}
