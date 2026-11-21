import { useNavigate } from 'react-router-dom'
import { LockKeyhole } from 'lucide-react'
import { paginaInicialDoCargo } from '../autenticacao/paginaInicialDoCargo.js'
import { useAutenticacao } from '../autenticacao/useAutenticacao.js'
import Botao from '../componentes/Botao.jsx'

export default function PaginaAcessoNegado() {
  const { usuario } = useAutenticacao()
  const navigate = useNavigate()

  return (
    <div className="state-page">
      <span>
        <LockKeyhole />
      </span>
      <p className="eyebrow">ACESSO RESTRITO</p>
      <h1>Acesso não permitido para o seu perfil</h1>
      <p>
        O perfil <strong>{usuario.funcao}</strong> não possui permissão para visualizar esta área.
        Se você acredita que isso é um engano, procure o administrador.
      </p>
      <Botao onClick={() => navigate(paginaInicialDoCargo(usuario.cargo))}>
        Voltar à página inicial
      </Botao>
    </div>
  )
}
