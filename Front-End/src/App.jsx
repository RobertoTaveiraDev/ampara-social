import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProvedorAutenticacao from './autenticacao/ProvedorAutenticacao.jsx'
import RotaProtegida from './autenticacao/RotaProtegida.jsx'
import Layout from './componentes/Layout.jsx'
import PaginaFamilias from './paginas/Familias/PaginaFamilias.jsx'
import PaginaFormularioFamilia from './paginas/Familias/PaginaFormularioFamilia.jsx'
import PaginaDetalheMunicipe from './paginas/Municipes/PaginaDetalheMunicipe.jsx'
import PaginaFormularioMunicipe from './paginas/Municipes/PaginaFormularioMunicipe.jsx'
import PaginaMunicipes from './paginas/Municipes/PaginaMunicipes.jsx'
import PaginaLogin from './paginas/PaginaLogin.jsx'
import PaginaQuemSomos from './paginas/PaginaQuemSomos.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <ProvedorAutenticacao>
        <Routes>
          <Route path="/login" element={<PaginaLogin />} />
          <Route element={<RotaProtegida />}>
            <Route element={<Layout />}>
              <Route path="/municipes" element={<PaginaMunicipes />} />
              <Route path="/municipes/novo" element={<PaginaFormularioMunicipe key="novo" />} />
              <Route path="/municipes/:id" element={<PaginaDetalheMunicipe />} />
              <Route path="/municipes/:id/editar" element={<PaginaFormularioMunicipe key="edicao" />} />
              <Route path="/familias" element={<PaginaFamilias />} />
              <Route path="/familias/nova" element={<PaginaFormularioFamilia key="nova" />} />
              <Route path="/familias/:id/editar" element={<PaginaFormularioFamilia key="edicao" />} />
              <Route path="/quem-somos" element={<PaginaQuemSomos />} />
              <Route path="*" element={<Navigate to="/municipes" replace />} />
            </Route>
          </Route>
        </Routes>
      </ProvedorAutenticacao>
    </BrowserRouter>
  )
}
