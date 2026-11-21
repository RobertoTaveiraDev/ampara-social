import { useAutenticacao } from '../autenticacao/useAutenticacao.js'

export default function Cabecalho() {
  const { usuario } = useAutenticacao()

  return (
    <header className="topbar">
      <strong>{usuario.nome}</strong>
      <span style={{ color: `var(--${usuario.unidadeTipo.toLowerCase()})` }}>{usuario.unidadeNome}</span>
    </header>
  )
}
