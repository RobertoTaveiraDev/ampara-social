import { NavLink, useNavigate } from 'react-router-dom'
import { BookOpen, Building2, Home, LogOut, UserCog, Users } from 'lucide-react'
import { useAutenticacao } from '../autenticacao/useAutenticacao.js'
import Logo from './Logo.jsx'

export default function MenuLateral() {
  const { usuario, sair } = useAutenticacao()
  const navigate = useNavigate()

  function sairDoSistema() {
    sair()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <Logo />
      <nav>
        {usuario.perfil === 'gestor' ? (
          <>
            <NavLink to="/usuarios">
              <UserCog size={19} /> Usuários
            </NavLink>
            <NavLink to="/unidades">
              <Building2 size={19} /> Unidades
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/municipes">
              <Users size={19} /> Munícipes
            </NavLink>
            <NavLink to="/familias">
              <Home size={19} /> Famílias
            </NavLink>
          </>
        )}
        <NavLink to="/quem-somos">
          <BookOpen size={19} /> Quem Somos
        </NavLink>
        <button onClick={sairDoSistema}>
          <LogOut size={19} /> Sair
        </button>
      </nav>
    </aside>
  )
}
