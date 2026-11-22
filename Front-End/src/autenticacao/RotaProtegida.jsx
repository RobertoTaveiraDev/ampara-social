import { Navigate, Outlet } from 'react-router-dom'
import IrParaPaginaInicial from './IrParaPaginaInicial.jsx'
import { useAutenticacao } from './useAutenticacao.js'

export default function RotaProtegida({ perfil }) {
  const { usuario } = useAutenticacao()

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  if (perfil && usuario.perfil !== perfil) {
    return <IrParaPaginaInicial />
  }

  return <Outlet />
}
