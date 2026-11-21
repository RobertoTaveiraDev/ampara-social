import { useEffect, useState } from 'react'
import { requisitar } from '../api/cliente.js'
import { ContextoAutenticacao } from './ContextoAutenticacao.js'

export default function ProvedorAutenticacao({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(() => sessionStorage.getItem('token') !== null)

  useEffect(() => {
    if (!sessionStorage.getItem('token')) {
      return
    }

    requisitar('/me')
      .then(setUsuario)
      .catch(() => sessionStorage.removeItem('token'))
      .finally(() => setCarregando(false))
  }, [])

  async function entrar(email, senha) {
    const resposta = await requisitar('/login', { metodo: 'POST', corpo: { email, senha } })
    sessionStorage.setItem('token', resposta.token)
    setUsuario(resposta.usuario)
  }

  function sair() {
    sessionStorage.removeItem('token')
    setUsuario(null)
  }

  return (
    <ContextoAutenticacao.Provider value={{ usuario, carregando, entrar, sair }}>
      {children}
    </ContextoAutenticacao.Provider>
  )
}
