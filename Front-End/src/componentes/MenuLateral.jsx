import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  BookOpen,
  FileClock,
  Home,
  LockKeyhole,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  UserPlus,
} from 'lucide-react'
import Logo from './Logo.jsx'
import { useAutenticacao } from '../autenticacao/useAutenticacao.js'

const itensDasUnidades = [
  { caminho: '/', rotulo: 'Início', Icone: Home },
  { caminho: '/buscar', rotulo: 'Buscar munícipe', Icone: Search },
  { caminho: '/cadastro', rotulo: 'Novo cadastro', Icone: UserPlus },
  { caminho: '/encaminhamentos', rotulo: 'Encaminhamentos', Icone: Network },
]

const itensPorCargo = {
  tecnico: itensDasUnidades,
  coordenador: itensDasUnidades,
  gestor: [
    { caminho: '/gestao', rotulo: 'Painel da rede', Icone: BarChart3 },
    { caminho: '/auditoria', rotulo: 'Auditoria', Icone: FileClock },
  ],
  admin: [
    { caminho: '/administracao', rotulo: 'Administração', Icone: Settings },
    { caminho: '/auditoria', rotulo: 'Auditoria', Icone: FileClock },
  ],
}

export default function MenuLateral({ recolhido, abertoNoCelular, aoAlternarRecolhido, aoFechar }) {
  const { usuario } = useAutenticacao()

  return (
    <aside className={`sidebar ${abertoNoCelular ? 'open' : ''}`}>
      <div className="sidebar-head">
        <Logo recolhida={recolhido} />
        <button
          className="collapse-button"
          onClick={aoAlternarRecolhido}
          aria-label={recolhido ? 'Expandir menu' : 'Recolher menu'}
        >
          {recolhido ? <PanelLeftOpen /> : <PanelLeftClose />}
        </button>
      </div>
      {!recolhido && <p className="nav-caption">ÁREA DE TRABALHO</p>}
      <nav>
        {itensPorCargo[usuario.cargo].map(({ caminho, rotulo, Icone }) => (
          <NavLink key={caminho} to={caminho} end={caminho === '/'} onClick={aoFechar}>
            <Icone size={19} />
            <span>{rotulo}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <NavLink to="/quem-somos" onClick={aoFechar}>
          <BookOpen size={19} />
          <span>Quem somos</span>
        </NavLink>
        {!recolhido && (
          <div className="privacy-note">
            <LockKeyhole size={17} />
            <span>
              <strong>Sigilo por unidade</strong>O conteúdo de atendimentos permanece protegido.
            </span>
          </div>
        )}
      </div>
    </aside>
  )
}
