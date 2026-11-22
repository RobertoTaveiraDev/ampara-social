import { BrowserRouter, Route, Routes } from 'react-router-dom'
import IrParaPaginaInicial from './autenticacao/IrParaPaginaInicial.jsx'
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
import PaginaFormularioUnidade from './paginas/Unidades/PaginaFormularioUnidade.jsx'
import PaginaUnidades from './paginas/Unidades/PaginaUnidades.jsx'
import PaginaFormularioUsuario from './paginas/Usuarios/PaginaFormularioUsuario.jsx'
import PaginaUsuarios from './paginas/Usuarios/PaginaUsuarios.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <ProvedorAutenticacao>
        <Routes>
          <Route path="/login" element={<PaginaLogin />} />
          <Route element={<RotaProtegida />}>
            <Route element={<Layout />}>
              <Route element={<RotaProtegida perfil="servidor" />}>
                <Route path="/municipes" element={<PaginaMunicipes />} />
                <Route path="/municipes/novo" element={<PaginaFormularioMunicipe key="novo" />} />
                <Route path="/municipes/:id" element={<PaginaDetalheMunicipe />} />
                <Route path="/municipes/:id/editar" element={<PaginaFormularioMunicipe key="edicao" />} />
                <Route path="/familias" element={<PaginaFamilias />} />
                <Route path="/familias/nova" element={<PaginaFormularioFamilia key="nova" />} />
                <Route path="/familias/:id/editar" element={<PaginaFormularioFamilia key="edicao" />} />
              </Route>
              <Route element={<RotaProtegida perfil="gestor" />}>
                <Route path="/usuarios" element={<PaginaUsuarios />} />
                <Route path="/usuarios/novo" element={<PaginaFormularioUsuario key="novo" />} />
                <Route path="/usuarios/:id/editar" element={<PaginaFormularioUsuario key="edicao" />} />
                <Route path="/unidades" element={<PaginaUnidades />} />
                <Route path="/unidades/nova" element={<PaginaFormularioUnidade key="nova" />} />
                <Route path="/unidades/:id/editar" element={<PaginaFormularioUnidade key="edicao" />} />
              </Route>
              <Route path="/quem-somos" element={<PaginaQuemSomos />} />
              <Route path="*" element={<IrParaPaginaInicial />} />
            </Route>
          </Route>
        </Routes>
      </ProvedorAutenticacao>
    </BrowserRouter>
  )
}
