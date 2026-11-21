import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Info } from 'lucide-react'
import { ErroDaApi } from '../../api/cliente.js'
import { paginaInicialDoCargo } from '../../autenticacao/paginaInicialDoCargo.js'
import { useAutenticacao } from '../../autenticacao/useAutenticacao.js'
import Botao from '../../componentes/Botao.jsx'
import ApresentacaoLogin from './ApresentacaoLogin.jsx'

export default function PaginaLogin() {
  const { usuario, entrar } = useAutenticacao()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [senhaVisivel, setSenhaVisivel] = useState(false)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  if (usuario) {
    return <Navigate to={paginaInicialDoCargo(usuario.cargo)} replace />
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
      <ApresentacaoLogin />
      <section className="login-panel">
        <div className="login-form-wrap">
          <div>
            <h2>Boas-vindas</h2>
            <p className="muted">Entre com suas credenciais institucionais.</p>
          </div>
          <form onSubmit={enviar} className="form-stack">
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
              <div className="password-field">
                <input
                  type={senhaVisivel ? 'text' : 'password'}
                  value={senha}
                  onChange={(evento) => setSenha(evento.target.value)}
                  placeholder="Sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setSenhaVisivel((visivel) => !visivel)}
                  aria-label={senhaVisivel ? 'Esconder senha' : 'Mostrar senha'}
                >
                  {senhaVisivel ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            {erro && <p className="field-error">{erro}</p>}
            <Botao type="submit" disabled={enviando}>
              Entrar <ArrowRight size={18} />
            </Botao>
          </form>
          <Link className="about-link" to="/quem-somos">
            <Info size={17} /> Conheça o projeto AMPARA SOCIAL
          </Link>
        </div>
      </section>
    </main>
  )
}
