import { Outlet } from 'react-router-dom'
import Cabecalho from './Cabecalho.jsx'
import MenuLateral from './MenuLateral.jsx'

export default function Layout() {
  return (
    <div className="app-shell">
      <MenuLateral />
      <div className="main-column">
        <Cabecalho />
        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
