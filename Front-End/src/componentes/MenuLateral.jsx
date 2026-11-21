import { NavLink, useNavigate } from 'react-router-dom'
import { BookOpen, Home, LogOut, Users } from 'lucide-react'
import { useAutenticacao } from '../autenticacao/useAutenticacao.js'
import Logo from './Logo.jsx'

export default function MenuLateral() {
  const { sair } = useAutenticacao()
  const navigate = useNavigate()

  function sairDoSistema() {
    sair()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <Logo />
      <nav>
        <NavLink to="/municipes">
          <Users size={19} /> Munícipes
        </NavLink>
        <NavLink to="/familias">
          <Home size={19} /> Famílias
        </NavLink>
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
