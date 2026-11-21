import { useState } from 'react'
import { requisitar } from '../api/cliente.js'
import { ContextoAutenticacao } from './ContextoAutenticacao.js'

export default function ProvedorAutenticacao({ children }) {
  const [usuario, setUsuario] = useState(() => JSON.parse(sessionStorage.getItem('usuario')))

  async function entrar(email, senha) {
    const resposta = await requisitar('/login', { metodo: 'POST', corpo: { email, senha } })
    sessionStorage.setItem('token', resposta.token)
    sessionStorage.setItem('usuario', JSON.stringify(resposta.usuario))
    setUsuario(resposta.usuario)
  }

  function sair() {
    sessionStorage.clear()
    setUsuario(null)
  }

  return (
    <ContextoAutenticacao.Provider value={{ usuario, entrar, sair }}>
      {children}
    </ContextoAutenticacao.Provider>
  )
}
