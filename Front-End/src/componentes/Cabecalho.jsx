import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut, Menu, ShieldCheck } from 'lucide-react'
import { useAutenticacao } from '../autenticacao/useAutenticacao.js'
import { iniciaisDoNome } from '../utilitarios/nomes.js'

const lotacaoSemUnidade = {
  gestor: { nome: 'Gestão Municipal', cor: 'var(--petrol)' },
  admin: { nome: 'Administração', cor: 'var(--muted)' },
}

export default function Cabecalho({ aoAbrirMenu }) {
  const { usuario, sair } = useAutenticacao()
  const navigate = useNavigate()
  const [menuDoPerfilAberto, setMenuDoPerfilAberto] = useState(false)

  const lotacao = usuario.unidadeTipo
    ? { nome: usuario.unidadeNome, cor: `var(--${usuario.unidadeTipo.toLowerCase()})` }
    : lotacaoSemUnidade[usuario.cargo]

  function sairDoSistema() {
    sair()
    navigate('/login')
  }

  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={aoAbrirMenu} aria-label="Abrir menu">
        <Menu />
      </button>
      {!usuario.unidadeTipo && (
        <div className="topbar-context">
          <ShieldCheck size={19} /> Ambiente institucional
        </div>
      )}
      <div className="top-actions">
        <div className="profile-switcher">
          <button className="current-profile" onClick={() => setMenuDoPerfilAberto((aberto) => !aberto)}>
            <span className="avatar">{iniciaisDoNome(usuario.nome)}</span>
            <span className="profile-copy">
              <strong>{usuario.nome}</strong>
              <small>
                {usuario.funcao} · <b style={{ color: lotacao.cor }}>{lotacao.nome}</b>
              </small>
            </span>
            <ChevronDown size={16} />
          </button>
          {menuDoPerfilAberto && (
            <div className="profile-menu">
              <button className="logout" onClick={sairDoSistema}>
                <LogOut size={16} /> Sair do sistema
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
