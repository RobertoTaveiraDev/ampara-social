import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProvedorAutenticacao from './autenticacao/ProvedorAutenticacao.jsx'
import RotaProtegida from './autenticacao/RotaProtegida.jsx'
import Layout from './componentes/Layout.jsx'
import PaginaAcessoNegado from './paginas/PaginaAcessoNegado.jsx'
import PaginaLogin from './paginas/Login/PaginaLogin.jsx'
import PaginaNaoEncontrada from './paginas/PaginaNaoEncontrada.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <ProvedorAutenticacao>
        <Routes>
          <Route path="/login" element={<PaginaLogin />} />
          <Route element={<RotaProtegida />}>
            <Route element={<Layout />}>
              <Route path="/acesso-negado" element={<PaginaAcessoNegado />} />
              <Route path="*" element={<PaginaNaoEncontrada />} />
            </Route>
          </Route>
        </Routes>
      </ProvedorAutenticacao>
    </BrowserRouter>
  )
}
