import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { paginaInicialDoCargo } from '../autenticacao/paginaInicialDoCargo.js'
import { useAutenticacao } from '../autenticacao/useAutenticacao.js'

export default function PaginaNaoEncontrada() {
  const { usuario } = useAutenticacao()

  return (
    <div className="state-page">
      <span>
        <Search />
      </span>
      <h1>Página não encontrada</h1>
      <p>O endereço informado não está disponível.</p>
      <Link className="button primary" to={paginaInicialDoCargo(usuario.cargo)}>
        Ir para o início
      </Link>
    </div>
  )
}
