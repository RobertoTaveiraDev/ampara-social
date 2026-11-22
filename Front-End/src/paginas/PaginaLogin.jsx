import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { ErroDaApi } from '../api/cliente.js'
import IrParaPaginaInicial from '../autenticacao/IrParaPaginaInicial.jsx'
import { useAutenticacao } from '../autenticacao/useAutenticacao.js'
import Botao from '../componentes/Botao.jsx'
import Logo from '../componentes/Logo.jsx'

export default function PaginaLogin() {
  const { usuario, entrar } = useAutenticacao()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  if (usuario) {
    return <IrParaPaginaInicial />
  }

  async function enviar(evento) {
    evento.preventDefault()
    setErro('')
    setEnviando(true)

    try {
      await entrar(email, senha)
    } catch (falha) {
      setErro(falha instanceof ErroDaApi ? falha.message : 'Não foi possível conectar ao servidor')
      setEnviando(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-story">
        <Logo fundoEscuro />
        <h1>A rede de proteção social, conectada e com sigilo.</h1>
      </section>
      <section className="login-panel">
        <form onSubmit={enviar} className="form-stack">
          <h2>Boas-vindas</h2>
          <p className="muted">Entre com suas credenciais institucionais.</p>
          <label>
            E-mail institucional
            <input
              type="email"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              placeholder="nome@ampara.gov.br"
              required
            />
          </label>
          <label>
            Senha
            <input
              type="password"
              value={senha}
              onChange={(evento) => setSenha(evento.target.value)}
              placeholder="Sua senha"
              required
            />
          </label>
          {erro && <p className="field-error">{erro}</p>}
          <Botao type="submit" disabled={enviando}>
            Entrar <ArrowRight size={18} />
          </Botao>
        </form>
      </section>
    </main>
  )
}
