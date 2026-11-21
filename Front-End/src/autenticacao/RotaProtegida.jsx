import { Navigate, Outlet } from 'react-router-dom'
import { useAutenticacao } from './useAutenticacao.js'

export default function RotaProtegida() {
  const { usuario, carregando } = useAutenticacao()

  if (carregando) {
    return null
  }

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
