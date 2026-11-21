import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Cabecalho from './Cabecalho.jsx'
import MenuLateral from './MenuLateral.jsx'

export default function Layout() {
  const [menuRecolhido, setMenuRecolhido] = useState(false)
  const [menuAbertoNoCelular, setMenuAbertoNoCelular] = useState(false)

  return (
    <div className={`app-shell ${menuRecolhido ? 'sidebar-collapsed' : ''}`}>
      <MenuLateral
        recolhido={menuRecolhido}
        abertoNoCelular={menuAbertoNoCelular}
        aoAlternarRecolhido={() => setMenuRecolhido((recolhido) => !recolhido)}
        aoFechar={() => setMenuAbertoNoCelular(false)}
      />
      {menuAbertoNoCelular && (
        <button
          className="mobile-scrim"
          onClick={() => setMenuAbertoNoCelular(false)}
          aria-label="Fechar menu"
        />
      )}
      <div className="main-column">
        <Cabecalho aoAbrirMenu={() => setMenuAbertoNoCelular(true)} />
        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
