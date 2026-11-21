import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Pencil, Search, Trash2, UserPlus } from 'lucide-react'
import { requisitar } from '../../api/cliente.js'
import Botao from '../../componentes/Botao.jsx'
import TituloPagina from '../../componentes/TituloPagina.jsx'
import { formatarCpf, formatarData } from '../../utilitarios/formatos.js'

function buscarMunicipes(texto) {
  return requisitar(`/municipes?busca=${encodeURIComponent(texto)}`)
}

export default function PaginaMunicipes() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')
  const [municipes, setMunicipes] = useState([])
  const [erro, setErro] = useState('')

  useEffect(() => {
    buscarMunicipes('')
      .then(setMunicipes)
      .catch((falha) => setErro(falha.message))
  }, [])

  async function buscar(evento) {
    evento.preventDefault()
    setErro('')

    try {
      setMunicipes(await buscarMunicipes(busca))
    } catch (falha) {
      setErro(falha.message)
    }
  }

  async function excluir(municipe) {
    if (!window.confirm(`Excluir o cadastro de ${municipe.nome}?`)) {
      return
    }

    setErro('')

    try {
      await requisitar(`/municipes/${municipe.id}`, { metodo: 'DELETE' })
      setMunicipes(await buscarMunicipes(busca))
    } catch (falha) {
      setErro(falha.message)
    }
  }

  return (
    <>
      <TituloPagina titulo="Munícipes" descricao="Cadastro único compartilhado entre CRAS, CREAS e CAPS.">
        <Botao onClick={() => navigate('/municipes/novo')}>
          <UserPlus size={17} /> Novo munícipe
        </Botao>
      </TituloPagina>
      <form className="search-bar" onSubmit={buscar}>
        <input
          value={busca}
          onChange={(evento) => setBusca(evento.target.value)}
          placeholder="Buscar por nome ou CPF"
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
              <th>CPF</th>
              <th>Nascimento</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {municipes.map((municipe) => (
              <tr key={municipe.id}>
                <td>
                  <Link to={`/municipes/${municipe.id}`}>{municipe.nome}</Link>
                </td>
                <td className="mono">{formatarCpf(municipe.cpf)}</td>
                <td>{formatarData(municipe.dataNascimento)}</td>
                <td className="actions">
                  <Botao variante="secundario" onClick={() => navigate(`/municipes/${municipe.id}/editar`)}>
                    <Pencil size={15} /> Editar
                  </Botao>
                  <Botao variante="perigo" onClick={() => excluir(municipe)}>
                    <Trash2 size={15} /> Excluir
                  </Botao>
                </td>
              </tr>
            ))}
            {municipes.length === 0 && (
              <tr>
                <td colSpan="4" className="muted">
                  Nenhum munícipe encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
