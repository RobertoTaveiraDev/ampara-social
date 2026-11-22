import { Navigate } from 'react-router-dom'
import { useAutenticacao } from './useAutenticacao.js'

export default function IrParaPaginaInicial() {
  const { usuario } = useAutenticacao()

  return <Navigate to={usuario.perfil === 'gestor' ? '/usuarios' : '/municipes'} replace />
}
