import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Search, Trash2, UserPlus } from 'lucide-react'
import { requisitar } from '../../api/cliente.js'
import Botao from '../../componentes/Botao.jsx'
import TituloPagina from '../../componentes/TituloPagina.jsx'

function buscarUsuarios(texto) {
  return requisitar(`/usuarios?busca=${encodeURIComponent(texto)}`)
}

export default function PaginaUsuarios() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')
  const [usuarios, setUsuarios] = useState([])
  const [erro, setErro] = useState('')

  useEffect(() => {
    buscarUsuarios('')
      .then(setUsuarios)
      .catch((falha) => setErro(falha.message))
  }, [])

  async function buscar(evento) {
    evento.preventDefault()
    setErro('')

    try {
      setUsuarios(await buscarUsuarios(busca))
    } catch (falha) {
      setErro(falha.message)
    }
  }

  async function excluir(usuario) {
    if (!window.confirm(`Excluir o usuário ${usuario.nome}?`)) {
      return
    }

    setErro('')

    try {
      await requisitar(`/usuarios/${usuario.id}`, { metodo: 'DELETE' })
      setUsuarios(await buscarUsuarios(busca))
    } catch (falha) {
      setErro(falha.message)
    }
  }

  return (
    <>
      <TituloPagina titulo="Usuários" descricao="Servidores das unidades e gestores do sistema.">
        <Botao onClick={() => navigate('/usuarios/novo')}>
          <UserPlus size={17} /> Novo usuário
        </Botao>
      </TituloPagina>
      <form className="search-bar" onSubmit={buscar}>
        <input
          value={busca}
          onChange={(evento) => setBusca(evento.target.value)}
          placeholder="Buscar por nome ou e-mail"
        />
        <Botao type="submit">
          <Search size={17} /> Buscar
        </Botao>
      </form>
      {erro && <p className="alert error">{erro}</p>}
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Função</th>
              <th>Unidade</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nome}</td>
                <td>{usuario.email}</td>
                <td>{usuario.funcao}</td>
                <td>{usuario.perfil === 'gestor' ? 'Gestão geral' : usuario.unidadeNome}</td>
                <td className="actions">
                  <Botao variante="secundario" onClick={() => navigate(`/usuarios/${usuario.id}/editar`)}>
                    <Pencil size={15} /> Editar
                  </Botao>
                  <Botao variante="perigo" onClick={() => excluir(usuario)}>
                    <Trash2 size={15} /> Excluir
                  </Botao>
                </td>
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr>
                <td colSpan="5" className="muted">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
