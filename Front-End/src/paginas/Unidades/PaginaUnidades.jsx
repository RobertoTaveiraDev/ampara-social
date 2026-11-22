import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { requisitar } from '../../api/cliente.js'
import Botao from '../../componentes/Botao.jsx'
import TituloPagina from '../../componentes/TituloPagina.jsx'

function buscarUnidades(texto) {
  return requisitar(`/unidades?busca=${encodeURIComponent(texto)}`)
}

export default function PaginaUnidades() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')
  const [unidades, setUnidades] = useState([])
  const [erro, setErro] = useState('')

  useEffect(() => {
    buscarUnidades('')
      .then(setUnidades)
      .catch((falha) => setErro(falha.message))
  }, [])

  async function buscar(evento) {
    evento.preventDefault()
    setErro('')

    try {
      setUnidades(await buscarUnidades(busca))
    } catch (falha) {
      setErro(falha.message)
    }
  }

  async function excluir(unidade) {
    if (!window.confirm(`Excluir a unidade ${unidade.nome}?`)) {
      return
    }

    setErro('')

    try {
      await requisitar(`/unidades/${unidade.id}`, { metodo: 'DELETE' })
      setUnidades(await buscarUnidades(busca))
    } catch (falha) {
      setErro(falha.message)
    }
  }

  return (
    <>
      <TituloPagina titulo="Unidades" descricao="CRAS, CREAS e CAPS da rede municipal.">
        <Botao onClick={() => navigate('/unidades/nova')}>
          <Plus size={17} /> Nova unidade
        </Botao>
      </TituloPagina>
      <form className="search-bar" onSubmit={buscar}>
        <input value={busca} onChange={(evento) => setBusca(evento.target.value)} placeholder="Buscar por nome" />
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
              <th>Tipo</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {unidades.map((unidade) => (
              <tr key={unidade.id}>
                <td>{unidade.nome}</td>
                <td style={{ color: `var(--${unidade.tipo.toLowerCase()})`, fontWeight: 700 }}>{unidade.tipo}</td>
                <td className="actions">
                  <Botao variante="secundario" onClick={() => navigate(`/unidades/${unidade.id}/editar`)}>
                    <Pencil size={15} /> Editar
                  </Botao>
                  <Botao variante="perigo" onClick={() => excluir(unidade)}>
                    <Trash2 size={15} /> Excluir
                  </Botao>
                </td>
              </tr>
            ))}
            {unidades.length === 0 && (
              <tr>
                <td colSpan="3" className="muted">
                  Nenhuma unidade encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
